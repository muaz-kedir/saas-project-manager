// Task routes
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");

const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  moveTask,
  deleteTask
} = require("../controllers/task.controller");

// All routes require authentication and workspace context
router.use(auth);
router.use(tenant);

router.post("/column/:columnId", createTask);
router.get("/column/:columnId", getTasks);
router.get("/:id", getTask);
router.put("/:id", updateTask);
router.patch("/:id/move", moveTask);
router.delete("/:id", deleteTask);

module.exports = router;
