// Column controller
const Column = require("../models/Column");

// Create column
exports.createColumn = async (req, res) => {
  try {
    const { name, order } = req.body;
    const { boardId } = req.params;

    const column = await Column.create({
      name,
      order,
      board: boardId
    });

    res.status(201).json({
      message: "Column created successfully",
      column
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all columns in board
exports.getColumns = async (req, res) => {
  try {
    const { boardId } = req.params;

    const columns = await Column.find({ board: boardId })
      .sort({ order: 1 });

    res.json({
      count: columns.length,
      columns
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single column
exports.getColumn = async (req, res) => {
  try {
    const { id } = req.params;

    const column = await Column.findById(id);

    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    res.json({ column });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update column
exports.updateColumn = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, order } = req.body;

    const column = await Column.findById(id);

    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    column.name = name || column.name;
    if (order !== undefined) column.order = order;
    await column.save();

    res.json({
      message: "Column updated successfully",
      column
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete column
exports.deleteColumn = async (req, res) => {
  try {
    const { id } = req.params;

    const column = await Column.findById(id);

    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    await column.deleteOne();

    res.json({ message: "Column deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
