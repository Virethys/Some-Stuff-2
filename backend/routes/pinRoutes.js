const express = require('express');
const router = express.Router();
const {
  getPins,
  getPin,
  createPin,
  updatePin,
  deletePin
} = require('../controllers/pinController');
const { protect } = require('../middleware/auth');

router.get('/', getPins);
router.get('/:id', getPin);
router.post('/', protect, createPin);
router.put('/:id', protect, updatePin);
router.delete('/:id', protect, deletePin);

module.exports = router;
