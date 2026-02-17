// Task routes
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");

const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  moveTask,
  deleteTask,
  addComment,
  getActivity
} = require("../controllers/task.controller");

// All routes require authentication only
// No tenant middleware needed - tasks are accessed via columnId
router.use(auth);

router.post("/column/:columnId", createTask);
router.get("/column/:columnId", getTasks);
router.get("/:id", getTask);
router.put("/:id", updateTask);
router.patch("/:id/move", moveTask);
router.delete("/:id", deleteTask);
router.post("/:id/comments", addComment);
router.get("/:id/activity", getActivity);

module.exports = router;
