// Board controller
const Board = require("../models/Board");

// Create board
exports.createBoard = async (req, res) => {
  try {
    const { name } = req.body;
    const { projectId } = req.params;

    const board = await Board.create({
      name,
      project: projectId,
      createdBy: req.user.userId
    });

    res.status(201).json({
      message: "Board created successfully",
      board
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all boards in project
exports.getBoards = async (req, res) => {
  try {
    const { projectId } = req.params;

    const boards = await Board.find({ project: projectId })
      .populate("createdBy", "name email");

    res.json({
      count: boards.length,
      boards
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single board
exports.getBoard = async (req, res) => {
  try {
    const { id } = req.params;

    const board = await Board.findById(id)
      .populate("createdBy", "name email");

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.json({ board });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update board
exports.updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    board.name = name || board.name;
    await board.save();

    res.json({
      message: "Board updated successfully",
      board
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete board
exports.deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;

    const board = await Board.findById(id);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    await board.deleteOne();

    res.json({ message: "Board deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
