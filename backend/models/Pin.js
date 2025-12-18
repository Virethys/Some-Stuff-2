const mongoose = require('mongoose');

const pinSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: [true, 'Board ID is required']
  },
  tags: [{
    type: String,
    trim: true
  }],
  moods: [{
    type: String,
    enum: ['minimal', 'vibrant', 'dark', 'pastel', 'vintage', 'modern', 'cozy', 'elegant', 'playful', 'rustic', 'bohemian', 'industrial', 'tropical', 'romantic', 'urban', 'nature']
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pin', pinSchema);
