// Project controller
const Project = require("../models/Project");
const WorkspaceMember = require("../models/WorkspaceMember");

// Create project
exports.createProject = async (req, res) => {
  try {
    const { name, workspaceId } = req.body;

    if (!name || !workspaceId) {
      return res.status(400).json({
        error: "Validation error",
        message: "Project name and workspaceId are required"
      });
    }

    // Check if user is member of workspace
    const membership = await WorkspaceMember.findOne({
      workspace: workspaceId,
      user: req.user.userId
    });

    if (!membership) {
      return res.status(403).json({
        error: "Access denied",
        message: "You are not a member of this workspace"
      });
    }

    // Only Owner and Admin can create projects
    if (membership.role === 'MEMBER') {
      return res.status(403).json({
        error: "Permission denied",
        message: "Only workspace owners and admins can create projects"
      });
    }

    const project = await Project.create({
      name: name.trim(),
      workspace: workspaceId,
      createdBy: req.user.userId,
      isDeleted: false
    });

    const populatedProject = await Project.findById(project._id)
      .populate("createdBy", "name email");

    res.status(201).json({
      message: "Project created successfully",
      project: populatedProject
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ 
      error: "Failed to create project",
      message: error.message 
    });
  }
};

// Get all projects in workspace
exports.getProjects = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // Check if user is member of workspace
    const membership = await WorkspaceMember.findOne({
      workspace: workspaceId,
      user: req.user.userId
    });

    if (!membership) {
      return res.status(403).json({
        error: "Access denied",
        message: "You are not a member of this workspace"
      });
    }

    const projects = await Project.find({ 
      workspace: workspaceId,
      isDeleted: false 
    })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      count: projects.length,
      projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ 
      error: "Failed to get projects",
      message: error.message 
    });
  }
};

// Get single project
exports.getProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id)
      .populate("createdBy", "name email");

    if (!project || project.isDeleted) {
      return res.status(404).json({ 
        error: "Not found",
        message: "Project not found" 
      });
    }

    // Check if user is member of workspace
    const membership = await WorkspaceMember.findOne({
      workspace: project.workspace,
      user: req.user.userId
    });

    if (!membership) {
      return res.status(403).json({
        error: "Access denied",
        message: "You are not a member of this workspace"
      });
    }

    res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ 
      error: "Failed to get project",
      message: error.message 
    });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const project = await Project.findById(id);

    if (!project || project.isDeleted) {
      return res.status(404).json({ 
        error: "Not found",
        message: "Project not found" 
      });
    }

    // Check if user is member of workspace
    const membership = await WorkspaceMember.findOne({
      workspace: project.workspace,
      user: req.user.userId
    });

    if (!membership) {
      return res.status(403).json({
        error: "Access denied",
        message: "You are not a member of this workspace"
      });
    }

    // Only Owner and Admin can update projects
    if (membership.role === 'MEMBER') {
      return res.status(403).json({
        error: "Permission denied",
        message: "Only workspace owners and admins can update projects"
      });
    }

    project.name = name?.trim() || project.name;
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("createdBy", "name email");

    res.json({
      message: "Project updated successfully",
      project: updatedProject
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ 
      error: "Failed to update project",
      message: error.message 
    });
  }
};

// Soft delete project
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project || project.isDeleted) {
      return res.status(404).json({ 
        error: "Not found",
        message: "Project not found" 
      });
    }

    // Check if user is member of workspace
    const membership = await WorkspaceMember.findOne({
      workspace: project.workspace,
      user: req.user.userId
    });

    if (!membership) {
      return res.status(403).json({
        error: "Access denied",
        message: "You are not a member of this workspace"
      });
    }

    // Only Owner can delete projects
    if (membership.role !== 'OWNER') {
      return res.status(403).json({
        error: "Permission denied",
        message: "Only workspace owners can delete projects"
      });
    }

    // Soft delete
    project.isDeleted = true;
    await project.save();

    res.json({ 
      message: "Project deleted successfully"
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ 
      error: "Failed to delete project",
      message: error.message 
    });
  }
};
