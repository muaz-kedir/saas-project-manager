// Workspace routes
const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth.middleware");
const {
  createWorkspace,
  getMyWorkspaces
} = require("./workspace.controller");

router.post("/", auth, createWorkspace);
router.get("/", auth, getMyWorkspaces);

module.exports = router;
