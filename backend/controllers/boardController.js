const Board = require('../models/Board');
const Pin = require('../models/Pin');

// @desc    Get all boards
// @route   GET /api/boards
// @access  Public
const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ isPrivate: false })
      .populate('userId', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single board
// @route   GET /api/boards/:id
// @access  Public
const getBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate('userId', 'username avatar');

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create board
// @route   POST /api/boards
// @access  Private
const createBoard = async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body;

    const board = await Board.create({
      name,
      description,
      isPrivate: isPrivate || false,
      userId: req.user._id
    });

    const populatedBoard = await Board.findById(board._id)
      .populate('userId', 'username avatar');

    res.status(201).json(populatedBoard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update board
// @route   PUT /api/boards/:id
// @access  Private
const updateBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Check if user owns the board
    if (board.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedBoard = await Board.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'username avatar');

    res.json(updatedBoard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete board
// @route   DELETE /api/boards/:id
// @access  Private
const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Check if user owns the board
    if (board.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete all pins in this board
    await Pin.deleteMany({ boardId: board._id });

    await board.deleteOne();

    res.json({ message: 'Board and all pins removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard
};
