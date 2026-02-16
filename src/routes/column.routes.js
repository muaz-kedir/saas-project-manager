// Column routes
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");

const {
  createColumn,
  getColumns,
  getColumn,
  updateColumn,
  deleteColumn
} = require("../controllers/column.controller");

// All routes require authentication only
// No tenant middleware needed - columns are accessed via boardId
router.use(auth);

router.post("/board/:boardId", createColumn);
router.get("/board/:boardId", getColumns);
router.get("/:id", getColumn);
router.put("/:id", updateColumn);
router.delete("/:id", deleteColumn);

module.exports = router;
