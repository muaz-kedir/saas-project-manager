// Project controller
const Project = require("../models/Project");

// Create project
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const workspaceId = req.workspace._id;

    const project = await Project.create({
      name,
      description,
      workspace: workspaceId,
      createdBy: req.user.userId
    });

    res.status(201).json({
      message: "Project created successfully",
      project
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all projects in workspace
exports.getProjects = async (req, res) => {
  try {
    const workspaceId = req.workspace._id;

    const projects = await Project.find({ workspace: workspaceId })
      .populate("createdBy", "name email");

    res.json({
      count: projects.length,
      projects
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single project
exports.getProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id)
      .populate("createdBy", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.name = name || project.name;
    project.description = description || project.description;
    await project.save();

    res.json({
      message: "Project updated successfully",
      project
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.deleteOne();

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
