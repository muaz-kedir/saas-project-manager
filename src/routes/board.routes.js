// Board routes
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");

const {
  createBoard,
  getBoards,
  getBoard,
  updateBoard,
  deleteBoard
} = require("../controllers/board.controller");

// All routes require authentication and workspace context
router.use(auth);
router.use(tenant);

router.post("/project/:projectId", createBoard);
router.get("/project/:projectId", getBoards);
router.get("/:id", getBoard);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);

module.exports = router;
