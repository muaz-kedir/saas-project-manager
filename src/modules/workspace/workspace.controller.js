// Workspace controller
const Workspace = require("../../models/Workspace");
const WorkspaceMember = require("../../models/WorkspaceMember");

// CREATE WORKSPACE
exports.createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;

    console.log('Creating workspace:', { name, description, userId: req.user.userId });

    // Validate required fields
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        error: "Validation error",
        message: "Workspace name is required"
      });
    }

    // Create workspace
    const workspace = await Workspace.create({
      name: name.trim(),
      description: description?.trim() || '',
      owner: req.user.userId
    });

    console.log('Workspace created:', workspace);

    // Add owner as member
    const member = await WorkspaceMember.create({
      user: req.user.userId,
      workspace: workspace._id,
      role: "OWNER"
    });

    console.log('Member created:', member);

    res.status(201).json({
      message: "Workspace created successfully",
      workspace: {
        id: workspace._id,
        name: workspace.name,
        description: workspace.description,
        owner: workspace.owner
      }
    });
  } catch (error) {
    console.error('Create workspace error:', error);
    res.status(500).json({ 
      error: "Failed to create workspace",
      message: error.message 
    });
  }
};

// GET MY WORKSPACES
exports.getMyWorkspaces = async (req, res) => {
  try {
    const memberships = await WorkspaceMember.find({
      user: req.user.userId
    }).populate("workspace");

    const workspaces = memberships.map(m => ({
      workspace: m.workspace,
      role: m.role,
      joinedAt: m.createdAt
    }));

    res.json({ 
      count: workspaces.length,
      workspaces 
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Failed to get workspaces",
      message: error.message 
    });
  }
};

// GET SINGLE WORKSPACE
exports.getWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    
    // Check if user is member
    const membership = await WorkspaceMember.findOne({
      workspace: workspace._id,
      user: req.user.userId,
    });
    
    if (!membership) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    res.json({ workspace });
  } catch (error) {
    res.status(500).json({ 
      error: "Failed to get workspace",
      message: error.message 
    });
  }
};

// UPDATE WORKSPACE
exports.updateWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const workspace = await Workspace.findById(req.params.id);
    
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    
    // Check if user is owner or admin
    const membership = await WorkspaceMember.findOne({
      workspace: workspace._id,
      user: req.user.userId,
      role: { $in: ["OWNER", "ADMIN"] },
    });
    
    if (!membership) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    workspace.name = name || workspace.name;
    workspace.description = description || workspace.description;
    await workspace.save();
    
    res.json({
      message: "Workspace updated successfully",
      workspace,
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Failed to update workspace",
      message: error.message 
    });
  }
};

// DELETE WORKSPACE
exports.deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    
    // Check if user is owner
    if (workspace.owner.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: "Only owner can delete workspace" });
    }
    
    // Delete all memberships
    await WorkspaceMember.deleteMany({ workspace: workspace._id });
    
    // Delete workspace
    await workspace.deleteOne();
    
    res.json({ message: "Workspace deleted successfully" });
  } catch (error) {
    res.status(500).json({ 
      error: "Failed to delete workspace",
      message: error.message 
    });
  }
};
