// Column routes
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");

const {
  createColumn,
  getColumns,
  getColumn,
  updateColumn,
  deleteColumn
} = require("../controllers/column.controller");

// All routes require authentication and workspace context
router.use(auth);
router.use(tenant);

router.post("/board/:boardId", createColumn);
router.get("/board/:boardId", getColumns);
router.get("/:id", getColumn);
router.put("/:id", updateColumn);
router.delete("/:id", deleteColumn);

module.exports = router;
