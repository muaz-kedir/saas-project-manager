// Workspace routes
const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth.middleware");
const tenant = require("../../middlewares/tenant.middleware");
const rbac = require("../../middlewares/rbac.middleware");

const {
  createWorkspace,
  getMyWorkspaces
} = require("./workspace.controller");

const {
  inviteUser
} = require("./workspace.invite.controller");

// create & list workspaces
router.post("/", auth, createWorkspace);
router.get("/", auth, getMyWorkspaces);

// invite users (OWNER only)
router.post(
  "/:workspaceId/invite",
  auth,
  tenant,
  rbac(["OWNER"]),
  inviteUser
);

module.exports = router;
