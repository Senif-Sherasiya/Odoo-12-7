const express = require('express');
const User = require('../models/User');
const Item = require('../models/Item');
const SwapRequest = require('../models/SwapRequest');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// All routes require admin authentication
router.use(protect, admin);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalItems = await Item.countDocuments();
    const pendingItems = await Item.countDocuments({ status: 'pending' });
    const totalSwaps = await SwapRequest.countDocuments();
    const completedSwaps = await SwapRequest.countDocuments({ status: 'accepted' });
    
    // Recent activity
    const recentItems = await Item.find()
      .populate('uploader', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentSwaps = await SwapRequest.find()
      .populate('fromUser', 'name')
      .populate('toUser', 'name')
      .populate('itemId', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalItems,
        pendingItems,
        totalSwaps,
        completedSwaps
      },
      recentActivity: {
        items: recentItems,
        swaps: recentSwaps
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/items/pending
// @desc    Get pending items for approval
// @access  Private (Admin only)
router.get('/items/pending', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const items = await Item.find({ status: 'pending' })
      .populate('uploader', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Item.countDocuments({ status: 'pending' });

    res.json({
      items,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get pending items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/items/:id/approve
// @desc    Approve an item
// @access  Private (Admin only)
router.put('/items/:id/approve', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.status !== 'pending') {
      return res.status(400).json({ message: 'Item is not pending approval' });
    }

    item.status = 'available';
    item.isApproved = true;
    item.approvedBy = req.user._id;
    item.approvedAt = Date.now();
    await item.save();

    await item.populate('uploader', 'name email');

    res.json(item);
  } catch (error) {
    console.error('Approve item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/items/:id/reject
// @desc    Reject an item
// @access  Private (Admin only)
router.put('/items/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.status !== 'pending') {
      return res.status(400).json({ message: 'Item is not pending approval' });
    }

    // Delete the item
    await item.remove();

    res.json({ message: 'Item rejected and removed', reason });
  } catch (error) {
    console.error('Reject item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { role: 'user' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id/ban
// @desc    Ban a user
// @access  Private (Admin only)
router.put('/users/:id/ban', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot ban admin users' });
    }

    // For now, we'll just mark them as banned in a field
    // In a real app, you might want to add a 'banned' field to the User model
    user.isBanned = true;
    await user.save();

    res.json({ message: 'User banned successfully' });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/items/:id
// @desc    Delete an item (admin override)
// @access  Private (Admin only)
router.delete('/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await item.remove();

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/reports
// @desc    Get platform reports
// @access  Private (Admin only)
router.get('/reports', async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    const newUsers = await User.countDocuments({
      createdAt: { $gte: daysAgo },
      role: 'user'
    });

    const newItems = await Item.countDocuments({
      createdAt: { $gte: daysAgo }
    });

    const newSwaps = await SwapRequest.countDocuments({
      createdAt: { $gte: daysAgo }
    });

    const completedSwaps = await SwapRequest.countDocuments({
      status: 'accepted',
      acceptedAt: { $gte: daysAgo }
    });

    // Category distribution
    const categoryStats = await Item.aggregate([
      { $match: { createdAt: { $gte: daysAgo } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      period: `${period} days`,
      stats: {
        newUsers,
        newItems,
        newSwaps,
        completedSwaps
      },
      categoryDistribution: categoryStats
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 