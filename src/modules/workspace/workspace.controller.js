// Workspace controller
const Workspace = require("../../models/Workspace");
const WorkspaceMember = require("../../models/WorkspaceMember");

// CREATE WORKSPACE
exports.createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;

    const workspace = await Workspace.create({
      name,
      ownerId: req.user.userId
    });

    await WorkspaceMember.create({
      userId: req.user.userId,
      workspaceId: workspace._id,
      role: "OWNER"
    });

    res.status(201).json({
      message: "Workspace created",
      workspace
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET MY WORKSPACES
exports.getMyWorkspaces = async (req, res) => {
  try {
    const memberships = await WorkspaceMember.find({
      userId: req.user.userId
    }).populate("workspaceId");

    res.json(memberships);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
