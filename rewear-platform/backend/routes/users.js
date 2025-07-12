const express = require('express');
const User = require('../models/User');
const Item = require('../models/Item');
const SwapRequest = require('../models/SwapRequest');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile with stats
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Get user stats
    const itemsCount = await Item.countDocuments({ uploader: req.user._id });
    const availableItemsCount = await Item.countDocuments({ 
      uploader: req.user._id, 
      status: 'available' 
    });
    const pendingSwapsCount = await SwapRequest.countDocuments({ 
      toUser: req.user._id, 
      status: 'pending' 
    });
    const completedSwapsCount = await SwapRequest.countDocuments({ 
      $or: [
        { fromUser: req.user._id, status: 'accepted' },
        { toUser: req.user._id, status: 'accepted' }
      ]
    });

    const userProfile = {
      ...user.toObject(),
      stats: {
        totalItems: itemsCount,
        availableItems: availableItemsCount,
        pendingSwaps: pendingSwapsCount,
        completedSwaps: completedSwapsCount
      }
    };

    res.json(userProfile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const itemsCount = await Item.countDocuments({ uploader: req.user._id });
    const availableItemsCount = await Item.countDocuments({ 
      uploader: req.user._id, 
      status: 'available' 
    });
    const pendingSwapsCount = await SwapRequest.countDocuments({ 
      toUser: req.user._id, 
      status: 'pending' 
    });
    const completedSwapsCount = await SwapRequest.countDocuments({ 
      $or: [
        { fromUser: req.user._id, status: 'accepted' },
        { toUser: req.user._id, status: 'accepted' }
      ]
    });

    res.json({
      totalPoints: req.user.points || 0,
      itemsListed: itemsCount,
      swapsCompleted: completedSwapsCount,
      pendingSwaps: pendingSwapsCount
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/my-items
// @desc    Get current user's items
// @access  Private
router.get('/my-items', protect, async (req, res) => {
  try {
    const items = await Item.find({ uploader: req.user._id })
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    console.error('Get my items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', protect, async (req, res) => {
  try {
    // Delete user's items
    await Item.deleteMany({ uploader: req.user._id });
    
    // Delete swap requests involving this user
    await SwapRequest.deleteMany({
      $or: [
        { fromUser: req.user._id },
        { toUser: req.user._id }
      ]
    });
    
    // Delete the user
    await User.findByIdAndDelete(req.user._id);
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { username, email, firstName, lastName, bio, location, phone } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        username,
        email,
        firstName,
        lastName,
        bio,
        location,
        phone
      },
      { new: true, runValidators: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/password
// @desc    Change user password
// @access  Private
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id);
    
    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user profile by ID (public info only)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    // Check if the ID is valid ObjectId
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = await User.findById(req.params.id).select('name avatar createdAt');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's available items
    const items = await Item.find({ 
      uploader: req.params.id, 
      status: 'available',
      isApproved: true 
    }).select('title images category type size condition pointValue createdAt');

    res.json({
      user,
      items
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/points/history
// @desc    Get user points history
// @access  Private
router.get('/points/history', protect, async (req, res) => {
  try {
    // This would typically come from a separate PointsHistory model
    // For now, we'll return basic info
    const user = await User.findById(req.user._id);
    
    res.json({
      currentPoints: user.points,
      message: 'Points history feature coming soon'
    });
  } catch (error) {
    console.error('Get points history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 