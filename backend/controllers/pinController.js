const Pin = require('../models/Pin');

// @desc    Get all pins
// @route   GET /api/pins
// @access  Public
const getPins = async (req, res) => {
  try {
    const { boardId, moods, tag } = req.query;
    
    let query = {};
    if (boardId) query.boardId = boardId;
    if (moods) {
      const moodArray = moods.split(',');
      query.moods = { $in: moodArray };
    }
    if (tag) query.tags = { $in: [tag] };

    const pins = await Pin.find(query)
      .populate('userId', 'username avatar')
      .populate('boardId', 'name')
      .sort({ createdAt: -1 });

    res.json(pins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single pin
// @route   GET /api/pins/:id
// @access  Public
const getPin = async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id)
      .populate('userId', 'username avatar')
      .populate('boardId', 'name');

    if (!pin) {
      return res.status(404).json({ message: 'Pin not found' });
    }

    res.json(pin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create pin
// @route   POST /api/pins
// @access  Private
const createPin = async (req, res) => {
  try {
    const { title, description, imageUrl, boardId, tags, moods } = req.body;

    const pin = await Pin.create({
      title,
      description,
      imageUrl,
      boardId,
      tags: tags || [],
      moods: moods || [],
      userId: req.user._id
    });

    const populatedPin = await Pin.findById(pin._id)
      .populate('userId', 'username avatar')
      .populate('boardId', 'name');

    res.status(201).json(populatedPin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update pin
// @route   PUT /api/pins/:id
// @access  Private
const updatePin = async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id);

    if (!pin) {
      return res.status(404).json({ message: 'Pin not found' });
    }

    // Check if user owns the pin or is admin
    const isOwner = pin.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedPin = await Pin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('userId', 'username avatar')
      .populate('boardId', 'name');

    res.json(updatedPin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete pin
// @route   DELETE /api/pins/:id
// @access  Private
const deletePin = async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id);

    if (!pin) {
      return res.status(404).json({ message: 'Pin not found' });
    }

    // Check if user owns the pin or is admin
    const isOwner = pin.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await pin.deleteOne();

    res.json({ message: 'Pin removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPins,
  getPin,
  createPin,
  updatePin,
  deletePin
};
