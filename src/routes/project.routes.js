// Project routes
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");

const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject
} = require("../controllers/project.controller");

// All routes require authentication
router.use(auth);

// Get projects by workspace
router.get("/workspace/:workspaceId", getProjects);

// Create, update, delete projects
router.post("/", createProject);
router.get("/:id", getProject);
router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
