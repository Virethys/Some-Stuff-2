const express = require('express');
const router = express.Router();
const {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard
} = require('../controllers/boardController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(getBoards)
  .post(protect, createBoard);

router.route('/:id')
  .get(getBoard)
  .put(protect, updateBoard)
  .delete(protect, deleteBoard);

module.exports = router;
