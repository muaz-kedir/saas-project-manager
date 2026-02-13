// Board routes
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");

const {
  createBoard,
  getBoards,
  getBoard,
  updateBoard,
  deleteBoard
} = require("../controllers/board.controller");

// All routes require authentication
router.use(auth);

// Get boards by project
router.get("/project/:projectId", getBoards);

// Create, update, delete boards
router.post("/", createBoard);
router.get("/:id", getBoard);
router.patch("/:id", updateBoard);
router.delete("/:id", deleteBoard);

module.exports = router;
