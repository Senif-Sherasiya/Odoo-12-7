const express = require('express');
const { body, validationResult } = require('express-validator');
const Item = require('../models/Item');
const { protect, admin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/items
// @desc    Create a new item
// @access  Private
router.post('/', protect, [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
  body('category').isIn(['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories', 'other']).withMessage('Invalid category'),
  body('type').isIn(['men', 'women', 'kids', 'unisex']).withMessage('Invalid type'),
  body('size').isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size']).withMessage('Invalid size'),
  body('condition').isIn(['new', 'like-new', 'good', 'fair', 'poor']).withMessage('Invalid condition'),
  body('pointValue').isInt({ min: 1 }).withMessage('Point value must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const itemData = {
      ...req.body,
      uploader: req.user._id,
      status: 'pending' // Items need admin approval
    };

    const item = await Item.create(itemData);
    await item.populate('uploader', 'name email');

    res.status(201).json(item);
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/items
// @desc    Get all approved items with filters
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      category,
      type,
      size,
      condition,
      search,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    // Build filter object
    const filter = { status: 'available', isApproved: true };

    if (category) filter.category = category;
    if (type) filter.type = type;
    if (size) filter.size = size;
    if (condition) filter.condition = condition;

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    const items = await Item.find(filter)
      .populate('uploader', 'name')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Item.countDocuments(filter);

    res.json({
      items,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/items/:id
// @desc    Get single item by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('uploader', 'name email phone')
      .populate('likes', 'name');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Increment views
    item.views += 1;
    await item.save();

    res.json(item);
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/items/:id
// @desc    Update item
// @access  Private (owner only)
router.put('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check ownership
    if (item.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Only allow updates if item is pending or available
    if (item.status !== 'pending' && item.status !== 'available') {
      return res.status(400).json({ message: 'Cannot update item that is swapped or redeemed' });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { ...req.body, status: 'pending' }, // Reset to pending for admin review
      { new: true, runValidators: true }
    ).populate('uploader', 'name email');

    res.json(updatedItem);
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/items/:id
// @desc    Delete item
// @access  Private (owner or admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check ownership or admin role
    if (item.uploader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await item.remove();
    res.json({ message: 'Item removed' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/items/:id/like
// @desc    Like/unlike an item
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const likeIndex = item.likes.indexOf(req.user._id);
    
    if (likeIndex > -1) {
      // Unlike
      item.likes.splice(likeIndex, 1);
    } else {
      // Like
      item.likes.push(req.user._id);
    }

    await item.save();
    res.json({ likes: item.likes, likeCount: item.likeCount });
  } catch (error) {
    console.error('Like item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/items/user/me
// @desc    Get current user's items
// @access  Private
router.get('/user/me', protect, async (req, res) => {
  try {
    const items = await Item.find({ uploader: req.user._id })
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    console.error('Get user items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 