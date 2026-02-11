// Workspace invite controller
const WorkspaceMember = require("../../models/WorkspaceMember");
const Workspace = require("../../models/Workspace");
const User = require("../../models/User");
const mongoose = require("mongoose");

// Invite user to workspace
exports.inviteUser = async (req, res) => {
  try {
    const { email, role } = req.body;
    const workspaceId = req.params.workspaceId;
    
    // Validate input
    if (!email) {
      return res.status(400).json({ 
        error: "Email is required",
        message: "Please provide an email address in the request body"
      });
    }

    // Validate workspaceId
    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).json({
        error: "Invalid workspace ID",
        message: "The workspaceId must be a valid MongoDB ObjectId"
      });
    }

    // Check if workspace exists
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ 
        error: "Workspace not found",
        message: "No workspace exists with the provided ID"
      });
    }

    // Check if the requesting user is a member and get their role
    const requesterMembership = await WorkspaceMember.findOne({
      workspace: workspaceId,
      user: req.user.userId
    });

    if (!requesterMembership) {
      return res.status(403).json({
        error: "Access denied",
        message: "You are not a member of this workspace"
      });
    }

    // Only OWNER can invite users
    if (requesterMembership.role !== "OWNER") {
      return res.status(403).json({
        error: "Permission denied",
        message: "Only workspace owners can invite users"
      });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ 
        error: "User not found",
        message: `No user exists with email: ${email}. The user must be registered first.`
      });
    }
    
    // Check if user is already a member
    const existingMember = await WorkspaceMember.findOne({
      workspace: workspaceId,
      user: user._id,
    });
    
    if (existingMember) {
      return res.status(400).json({ 
        error: "User already a member",
        message: "This user is already a member of the workspace"
      });
    }
    
    // Validate role
    const validRoles = ["OWNER", "ADMIN", "MEMBER"];
    const memberRole = role ? role.toUpperCase() : "MEMBER";
    
    if (!validRoles.includes(memberRole)) {
      return res.status(400).json({
        error: "Invalid role",
        message: `Role must be one of: ${validRoles.join(", ")}`
      });
    }
    
    // Add user as member
    const member = await WorkspaceMember.create({
      workspace: workspaceId,
      user: user._id,
      role: memberRole,
    });
    
    res.status(201).json({
      message: "User invited successfully",
      member: {
        id: member._id,
        email: user.email,
        name: user.name,
        role: member.role
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Failed to invite user",
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
