// Tenant middleware
const WorkspaceMember = require("../models/WorkspaceMember");
const mongoose = require("mongoose");

module.exports = async (req, res, next) => {
  try {
    const workspaceId = req.params.workspaceId;
    const userId = req.user.userId;

    // Validate workspaceId format
    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).json({
        error: "Invalid workspace ID format",
        message: "The workspaceId in the URL must be a valid MongoDB ObjectId (24 hex characters)",
        example: "Use an ID like: 507f1f77bcf86cd799439011"
      });
    }

    const membership = await WorkspaceMember.findOne({
      workspace: workspaceId,
      user: userId
    });

    if (!membership) {
      return res.status(403).json({
        error: "Access denied",
        message: "You are not a member of this workspace"
      });
    }

    // attach role to request
    req.user.role = membership.role;

    next();
  } catch (error) {
    res.status(500).json({ 
      error: "Tenant validation failed",
      message: error.message 
    });
  }
};
