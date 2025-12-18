const Comment = require('../models/Comment');

// Get comments for a pin
exports.getComments = async (req, res) => {
  try {
    const { pinId } = req.params;
    const comments = await Comment.find({ pinId })
      .populate('userId', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create comment
exports.createComment = async (req, res) => {
  try {
    const { pinId } = req.params;
    const { text } = req.body;

    const comment = await Comment.create({
      text,
      pinId,
      userId: req.user._id
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'username avatar');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check ownership or admin
    if (comment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
