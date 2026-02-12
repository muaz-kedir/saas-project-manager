// Workspace routes
const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth.middleware");

const {
  createWorkspace,
  getMyWorkspaces
} = require("./workspace.controller");

const {
  inviteUser,
  getMembers
} = require("./workspace.invite.controller");

// create & list workspaces
router.post("/", auth, createWorkspace);
router.get("/", auth, getMyWorkspaces);

// workspace members
router.get("/:workspaceId/members", auth, getMembers);
router.post("/:workspaceId/invite", auth, inviteUser);

module.exports = router;
