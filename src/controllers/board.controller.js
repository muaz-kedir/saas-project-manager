// Board controller
const Board = require("../models/Board");
const Project = require("../models/Project");
const WorkspaceMember = require("../models/WorkspaceMember");

// Create board
exports.createBoard = async (req, res) => {
  try {
    const { name, projectId } = req.body;

    if (!name || !projectId) {
      return res.status(400).json({
        error: "Validation error",
        message: "Board name and projectId are required"
      });
    }

    // Get project and check if it exists
    const project = await Project.findById(projectId);
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

    // Only Owner and Admin can create boards
    if (membership.role === 'MEMBER') {
      return res.status(403).json({
        error: "Permission denied",
        message: "Only workspace owners and admins can create boards"
      });
    }

    const board = await Board.create({
      name: name.trim(),
      project: projectId,
      createdBy: req.user.userId,
      isDeleted: false
    });

    const populatedBoard = await Board.findById(board._id)
      .populate("createdBy", "name email");

    res.status(201).json({
      message: "Board created successfully",
      board: populatedBoard
    });
  } catch (error) {
    console.error('Create board error:', error);
    res.status(500).json({ 
      error: "Failed to create board",
      message: error.message 
    });
  }
};

// Get all boards in project
exports.getBoards = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Get project
    const project = await Project.findById(projectId);
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

    const boards = await Board.find({ 
      project: projectId,
      isDeleted: false 
    })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      count: boards.length,
      boards
    });
  } catch (error) {
    console.error('Get boards error:', error);
    res.status(500).json({ 
      error: "Failed to get boards",
      message: error.message 
    });
  }
};

// Get single board
exports.getBoard = async (req, res) => {
  try {
    const { id } = req.params;

    const board = await Board.findById(id)
      .populate("createdBy", "name email")
      .populate("project");

    if (!board || board.isDeleted) {
      return res.status(404).json({ 
        error: "Not found",
        message: "Board not found" 
      });
    }

    // Get project to check workspace
    const project = await Project.findById(board.project);
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

    res.json({ board });
  } catch (error) {
    console.error('Get board error:', error);
    res.status(500).json({ 
      error: "Failed to get board",
      message: error.message 
    });
  }
};

// Update board
exports.updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const board = await Board.findById(id).populate("project");

    if (!board || board.isDeleted) {
      return res.status(404).json({ 
        error: "Not found",
        message: "Board not found" 
      });
    }

    // Get project
    const project = await Project.findById(board.project);
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

    // Only Owner and Admin can update boards
    if (membership.role === 'MEMBER') {
      return res.status(403).json({
        error: "Permission denied",
        message: "Only workspace owners and admins can update boards"
      });
    }

    board.name = name?.trim() || board.name;
    await board.save();

    const updatedBoard = await Board.findById(board._id)
      .populate("createdBy", "name email");

    res.json({
      message: "Board updated successfully",
      board: updatedBoard
    });
  } catch (error) {
    console.error('Update board error:', error);
    res.status(500).json({ 
      error: "Failed to update board",
      message: error.message 
    });
  }
};

// Soft delete board
exports.deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;

    const board = await Board.findById(id).populate("project");

    if (!board || board.isDeleted) {
      return res.status(404).json({ 
        error: "Not found",
        message: "Board not found" 
      });
    }

    // Get project
    const project = await Project.findById(board.project);
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

    // Only Owner can delete boards
    if (membership.role !== 'OWNER') {
      return res.status(403).json({
        error: "Permission denied",
        message: "Only workspace owners can delete boards"
      });
    }

    // Soft delete
    board.isDeleted = true;
    await board.save();

    res.json({ 
      message: "Board deleted successfully"
    });
  } catch (error) {
    console.error('Delete board error:', error);
    res.status(500).json({ 
      error: "Failed to delete board",
      message: error.message 
    });
  }
};
