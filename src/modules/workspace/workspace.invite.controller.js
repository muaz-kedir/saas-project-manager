// Workspace invite controller
const WorkspaceMember = require("../../models/WorkspaceMember");
const Workspace = require("../../models/Workspace");
const User = require("../../models/User");
const Invitation = require("../../models/Invitation");
const mongoose = require("mongoose");
const crypto = require('crypto');
const emailService = require('../../services/email.service');

// Invite user to workspace via EMAIL
exports.inviteUser = async (req, res) => {
  try {
    const { email, name, role } = req.body;
    const workspaceId = req.params.workspaceId;
    const inviterId = req.user.userId;
    
    // Validate input
    if (!email || !name) {
      return res.status(400).json({ 
        error: "Email and name are required",
        message: "Please provide both email and name in the request body"
      });
    }

    // Validate workspaceId
    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).json({
        error: "Invalid workspace ID",
        message: "The workspaceId must be a valid MongoDB ObjectId"
      });
    }

    const memberRole = role ? role.toUpperCase() : "MEMBER";

    // Validate role
    const validRoles = ["ADMIN", "MEMBER"];
    if (!validRoles.includes(memberRole)) {
      return res.status(400).json({
        error: "Invalid role",
        message: `Role must be one of: ${validRoles.join(", ")}`
      });
    }

    // Parallel queries for better performance
    const [workspace, requesterMembership, inviter] = await Promise.all([
      Workspace.findById(workspaceId),
      WorkspaceMember.findOne({
        workspace: workspaceId,
        user: inviterId
      }),
      User.findById(inviterId)
    ]);

    // Check if workspace exists
    if (!workspace) {
      return res.status(404).json({ 
        error: "Workspace not found",
        message: "No workspace exists with the provided ID"
      });
    }

    // Check if the requesting user is a member
    if (!requesterMembership) {
      return res.status(403).json({
        error: "Access denied",
        message: "You are not a member of this workspace"
      });
    }

    // Check permissions based on role
    const requesterRole = requesterMembership.role;

    // Only OWNER and ADMIN can invite users
    if (requesterRole !== "OWNER" && requesterRole !== "ADMIN") {
      return res.status(403).json({
        error: "Permission denied",
        message: "Only workspace owners and admins can invite users"
      });
    }

    // ADMIN can only invite MEMBER
    if (requesterRole === "ADMIN" && memberRole !== "MEMBER") {
      return res.status(403).json({
        error: "Permission denied",
        message: "Admins can only invite members, not other admins"
      });
    }
    
    // Check if user already exists and is a member
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const existingMember = await WorkspaceMember.findOne({
        workspace: workspaceId,
        user: existingUser._id,
      });
      
      if (existingMember) {
        return res.status(400).json({ 
          error: "User already a member",
          message: "This user is already a member of the workspace"
        });
      }
    }

    // Check for existing pending invitation
    const existingInvitation = await Invitation.findOne({
      workspace: workspaceId,
      email,
      status: 'pending'
    });

    if (existingInvitation) {
      return res.status(400).json({ 
        error: "Invitation already sent",
        message: "An invitation has already been sent to this email"
      });
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex');

    // Create invitation
    const invitation = await Invitation.create({
      workspace: workspaceId,
      email,
      name,
      role: memberRole,
      token,
      invitedBy: inviterId
    });

    // Send invitation email
    try {
      await emailService.sendInvitationEmail({
        to: email,
        name,
        workspaceName: workspace.name,
        inviterName: inviter.name,
        token
      });

      res.status(201).json({
        message: "Invitation sent successfully",
        invitation: {
          id: invitation._id,
          email: invitation.email,
          name: invitation.name,
          role: invitation.role,
          status: invitation.status,
          expiresAt: invitation.expiresAt
        }
      });
    } catch (emailError) {
      // Delete invitation if email fails
      await Invitation.findByIdAndDelete(invitation._id);
      throw new Error('Failed to send invitation email: ' + emailError.message);
    }
  } catch (error) {
    console.error('Invite user error:', error);
    res.status(500).json({ 
      error: "Failed to invite user",
      message: error.message 
    });
  }
};

// Accept invitation
exports.acceptInvitation = async (req, res) => {
  try {
    const { token } = req.params;
    const userId = req.user.userId;

    // Find invitation
    const invitation = await Invitation.findOne({ token, status: 'pending' })
      .populate('workspace', 'name');

    if (!invitation) {
      return res.status(404).json({
        error: "Invalid invitation",
        message: "This invitation is invalid or has already been used"
      });
    }

    // Check if expired
    if (new Date() > invitation.expiresAt) {
      invitation.status = 'expired';
      await invitation.save();
      return res.status(400).json({
        error: "Invitation expired",
        message: "This invitation has expired"
      });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "User account not found"
      });
    }

    // Verify email matches (if user is logged in)
    if (user.email !== invitation.email) {
      return res.status(403).json({
        error: "Email mismatch",
        message: "This invitation was sent to a different email address"
      });
    }

    // Check if already a member
    const existingMember = await WorkspaceMember.findOne({
      workspace: invitation.workspace._id,
      user: userId
    });

    if (existingMember) {
      invitation.status = 'accepted';
      await invitation.save();
      return res.status(400).json({
        error: "Already a member",
        message: "You are already a member of this workspace"
      });
    }

    // Add user to workspace
    const member = await WorkspaceMember.create({
      workspace: invitation.workspace._id,
      user: userId,
      role: invitation.role
    });

    // Mark invitation as accepted
    invitation.status = 'accepted';
    await invitation.save();

    res.json({
      message: "Invitation accepted successfully",
      workspace: {
        id: invitation.workspace._id,
        name: invitation.workspace.name
      },
      member: {
        id: member._id,
        role: member.role
      }
    });
  } catch (error) {
    console.error('Accept invitation error:', error);
    res.status(500).json({
      error: "Failed to accept invitation",
      message: error.message
    });
  }
};

// Get invitation details (public - no auth required)
exports.getInvitationDetails = async (req, res) => {
  try {
    const { token } = req.params;

    const invitation = await Invitation.findOne({ token, status: 'pending' })
      .populate('workspace', 'name')
      .populate('invitedBy', 'name email');

    if (!invitation) {
      return res.status(404).json({
        error: "Invalid invitation",
        message: "This invitation is invalid or has already been used"
      });
    }

    // Check if expired
    if (new Date() > invitation.expiresAt) {
      invitation.status = 'expired';
      await invitation.save();
      return res.status(400).json({
        error: "Invitation expired",
        message: "This invitation has expired"
      });
    }

    res.json({
      invitation: {
        email: invitation.email,
        name: invitation.name,
        role: invitation.role,
        workspace: {
          id: invitation.workspace._id,
          name: invitation.workspace.name
        },
        invitedBy: {
          name: invitation.invitedBy.name
        },
        expiresAt: invitation.expiresAt
      }
    });
  } catch (error) {
    console.error('Get invitation error:', error);
    res.status(500).json({
      error: "Failed to get invitation",
      message: error.message
    });
  }
};

// Remove user from workspace
exports.removeUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const workspaceId = req.params.workspaceId;
    
    const member = await WorkspaceMember.findOne({
      workspace: workspaceId,
      user: userId,
    });
    
    if (!member) {
      return res.status(404).json({ 
        error: "Member not found",
        message: "This user is not a member of the workspace"
      });
    }
    
    // Prevent removing owner
    if (member.role === "OWNER") {
      return res.status(400).json({ 
        error: "Cannot remove owner",
        message: "The workspace owner cannot be removed"
      });
    }
    
    await member.deleteOne();
    
    res.json({ message: "User removed successfully" });
  } catch (error) {
    res.status(500).json({ 
      error: "Failed to remove user",
      message: error.message 
    });
  }
};

// Get workspace members
exports.getMembers = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    
    const members = await WorkspaceMember.find({ workspace: workspaceId })
      .populate("user", "name email");
    
    res.json({ 
      count: members.length,
      members 
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Failed to get members",
      message: error.message 
    });
  }
};

// Update member role
exports.updateMemberRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const workspaceId = req.params.workspaceId;
    
    const member = await WorkspaceMember.findOne({
      workspace: workspaceId,
      user: userId,
    });
    
    if (!member) {
      return res.status(404).json({ 
        error: "Member not found",
        message: "This user is not a member of the workspace"
      });
    }
    
    // Prevent changing owner role
    if (member.role === "OWNER") {
      return res.status(400).json({ 
        error: "Cannot change owner role",
        message: "The workspace owner's role cannot be changed"
      });
    }

    // Validate role
    const validRoles = ["OWNER", "ADMIN", "MEMBER"];
    const newRole = role.toUpperCase();
    
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({
        error: "Invalid role",
        message: `Role must be one of: ${validRoles.join(", ")}`
      });
    }
    
    member.role = newRole;
    await member.save();
    
    res.json({
      message: "Member role updated successfully",
      member,
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Failed to update member role",
      message: error.message 
    });
  }
};
