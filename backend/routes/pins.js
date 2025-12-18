const express = require('express');
const {
  getAllPins,
  getPinById,
  createPin,
  updatePin,
  deletePin,
  getPinsByUser,
} = require('../controllers/pinController');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/pins - Get all pins (public)
router.get('/', getAllPins);

// GET /api/pins/user/:userId - Get pins by user (public)
router.get('/user/:userId', getPinsByUser);

// GET /api/pins/:id - Get single pin (public)
router.get('/:id', getPinById);

// POST /api/pins - Create pin (auth required)
router.post('/', auth, createPin);

// PUT /api/pins/:id - Update pin (auth required)
router.put('/:id', auth, updatePin);

// DELETE /api/pins/:id - Delete pin (auth required)
router.delete('/:id', auth, deletePin);

module.exports = router;
