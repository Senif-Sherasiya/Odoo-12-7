const express = require('express');
const { body, validationResult } = require('express-validator');
const SwapRequest = require('../models/SwapRequest');
const Item = require('../models/Item');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/swaps/my-swaps
// @desc    Get all swap requests for the current user (both sent and received)
// @access  Private
router.get('/my-swaps', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {
      $or: [
        { fromUser: req.user._id },
        { toUser: req.user._id }
      ]
    };
    if (status) filter.status = status;

    const swapRequests = await SwapRequest.find(filter)
      .populate([
        { path: 'fromUser', select: 'name email' },
        { path: 'toUser', select: 'name email' },
        { path: 'itemId', select: 'title images category condition size' },
        { path: 'offeredItem', select: 'title images category condition size' }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Add isInitiator flag to each swap request
    const swapsWithFlags = swapRequests.map(swap => ({
      ...swap.toObject(),
      isInitiator: swap.fromUser._id.toString() === req.user._id.toString()
    }));

    const total = await SwapRequest.countDocuments(filter);

    res.json({
      swaps: swapsWithFlags,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get my swaps error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/swaps/history
// @desc    Get completed swap history for the current user
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {
      $or: [
        { fromUser: req.user._id },
        { toUser: req.user._id }
      ],
      status: { $in: ['accepted', 'completed', 'declined', 'cancelled'] }
    };

    const swapRequests = await SwapRequest.find(filter)
      .populate([
        { path: 'fromUser', select: 'name email' },
        { path: 'toUser', select: 'name email' },
        { path: 'itemId', select: 'title images category condition size' },
        { path: 'offeredItem', select: 'title images category condition size' }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Add isInitiator flag to each swap request
    const swapsWithFlags = swapRequests.map(swap => ({
      ...swap.toObject(),
      isInitiator: swap.fromUser._id.toString() === req.user._id.toString()
    }));

    const total = await SwapRequest.countDocuments(filter);

    res.json({
      swaps: swapsWithFlags,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get swap history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/swaps/:id/reject
// @desc    Reject a swap request (alias for decline)
// @access  Private
router.put('/:id/reject', protect, [
  body('reason').optional().trim().isLength({ max: 200 }).withMessage('Reason cannot exceed 200 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const swapRequest = await SwapRequest.findById(req.params.id);

    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Check if user is the recipient
    if (swapRequest.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (swapRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Swap request is not pending' });
    }

    // Update swap request status
    swapRequest.status = 'declined';
    swapRequest.declinedAt = Date.now();
    swapRequest.reason = req.body.reason;
    await swapRequest.save();

    await swapRequest.populate([
      { path: 'fromUser', select: 'name email' },
      { path: 'toUser', select: 'name email' },
      { path: 'itemId', select: 'title images' },
      { path: 'offeredItem', select: 'title images' }
    ]);

    res.json(swapRequest);
  } catch (error) {
    console.error('Reject swap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/swaps
// @desc    Create a swap request
// @access  Private
router.post('/', protect, [
  body('itemId').isMongoId().withMessage('Valid item ID is required'),
  body('type').isIn(['swap', 'redeem']).withMessage('Type must be swap or redeem'),
  body('message').optional().trim().isLength({ max: 500 }).withMessage('Message cannot exceed 500 characters'),
  body('offeredItem').optional().isMongoId().withMessage('Valid offered item ID is required'),
  body('pointsOffered').optional().isInt({ min: 0 }).withMessage('Points must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { itemId, type, message, offeredItem, pointsOffered } = req.body;

    // Check if item exists and is available
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.status !== 'available') {
      return res.status(400).json({ message: 'Item is not available for swap' });
    }

    // Check if user is not trying to swap their own item
    if (item.uploader.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot swap your own item' });
    }

    // Check if there's already a pending request for this item from this user
    const existingRequest = await SwapRequest.findOne({
      fromUser: req.user._id,
      itemId: itemId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request for this item' });
    }

    // Validate swap type requirements
    if (type === 'swap' && !offeredItem) {
      return res.status(400).json({ message: 'Offered item is required for swap requests' });
    }

    if (type === 'redeem' && !pointsOffered) {
      return res.status(400).json({ message: 'Points offered is required for redeem requests' });
    }

    // Check if user has enough points for redeem
    if (type === 'redeem' && req.user.points < pointsOffered) {
      return res.status(400).json({ message: 'Insufficient points' });
    }

    // Check if offered item exists and belongs to user (for swaps)
    if (type === 'swap' && offeredItem) {
      const offeredItemDoc = await Item.findById(offeredItem);
      if (!offeredItemDoc) {
        return res.status(404).json({ message: 'Offered item not found' });
      }
      if (offeredItemDoc.uploader.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Offered item does not belong to you' });
      }
      if (offeredItemDoc.status !== 'available') {
        return res.status(400).json({ message: 'Offered item is not available' });
      }
    }

    const swapRequest = await SwapRequest.create({
      fromUser: req.user._id,
      toUser: item.uploader,
      itemId: itemId,
      type: type,
      message: message,
      offeredItem: offeredItem,
      pointsOffered: pointsOffered
    });

    await swapRequest.populate([
      { path: 'fromUser', select: 'name email' },
      { path: 'toUser', select: 'name email' },
      { path: 'itemId', select: 'title images' },
      { path: 'offeredItem', select: 'title images' }
    ]);

    res.status(201).json(swapRequest);
  } catch (error) {
    console.error('Create swap request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/swaps/received
// @desc    Get swap requests received by current user
// @access  Private
router.get('/received', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { toUser: req.user._id };
    if (status) filter.status = status;

    const swapRequests = await SwapRequest.find(filter)
      .populate([
        { path: 'fromUser', select: 'name email' },
        { path: 'itemId', select: 'title images category' },
        { path: 'offeredItem', select: 'title images category' }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SwapRequest.countDocuments(filter);

    res.json({
      swapRequests,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get received swaps error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/swaps/sent
// @desc    Get swap requests sent by current user
// @access  Private
router.get('/sent', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { fromUser: req.user._id };
    if (status) filter.status = status;

    const swapRequests = await SwapRequest.find(filter)
      .populate([
        { path: 'toUser', select: 'name email' },
        { path: 'itemId', select: 'title images category' },
        { path: 'offeredItem', select: 'title images category' }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SwapRequest.countDocuments(filter);

    res.json({
      swapRequests,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get sent swaps error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/swaps/:id/accept
// @desc    Accept a swap request
// @access  Private
router.put('/:id/accept', protect, async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id);

    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Check if user is the recipient
    if (swapRequest.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (swapRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Swap request is not pending' });
    }

    // Update swap request status
    swapRequest.status = 'accepted';
    swapRequest.acceptedAt = Date.now();
    await swapRequest.save();

    // Update item status
    const item = await Item.findById(swapRequest.itemId);
    item.status = swapRequest.type === 'redeem' ? 'redeemed' : 'swapped';
    await item.save();

    // Handle points transfer for redeem
    if (swapRequest.type === 'redeem') {
      const fromUser = await User.findById(swapRequest.fromUser);
      const toUser = await User.findById(swapRequest.toUser);

      await fromUser.deductPoints(swapRequest.pointsOffered);
      await toUser.addPoints(swapRequest.pointsOffered);
    }

    // Update offered item status if it's a swap
    if (swapRequest.type === 'swap' && swapRequest.offeredItem) {
      const offeredItem = await Item.findById(swapRequest.offeredItem);
      offeredItem.status = 'swapped';
      await offeredItem.save();
    }

    await swapRequest.populate([
      { path: 'fromUser', select: 'name email' },
      { path: 'toUser', select: 'name email' },
      { path: 'itemId', select: 'title images' },
      { path: 'offeredItem', select: 'title images' }
    ]);

    res.json(swapRequest);
  } catch (error) {
    console.error('Accept swap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/swaps/:id/decline
// @desc    Decline a swap request
// @access  Private
router.put('/:id/decline', protect, [
  body('reason').optional().trim().isLength({ max: 200 }).withMessage('Reason cannot exceed 200 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const swapRequest = await SwapRequest.findById(req.params.id);

    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Check if user is the recipient
    if (swapRequest.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (swapRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Swap request is not pending' });
    }

    // Update swap request status
    swapRequest.status = 'declined';
    swapRequest.declinedAt = Date.now();
    swapRequest.reason = req.body.reason;
    await swapRequest.save();

    await swapRequest.populate([
      { path: 'fromUser', select: 'name email' },
      { path: 'toUser', select: 'name email' },
      { path: 'itemId', select: 'title images' },
      { path: 'offeredItem', select: 'title images' }
    ]);

    res.json(swapRequest);
  } catch (error) {
    console.error('Decline swap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/swaps/:id/cancel
// @desc    Cancel a swap request (by sender)
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id);

    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Check if user is the sender
    if (swapRequest.fromUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (swapRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Swap request is not pending' });
    }

    // Update swap request status
    swapRequest.status = 'cancelled';
    swapRequest.cancelledAt = Date.now();
    swapRequest.cancelledBy = req.user._id;
    await swapRequest.save();

    await swapRequest.populate([
      { path: 'fromUser', select: 'name email' },
      { path: 'toUser', select: 'name email' },
      { path: 'itemId', select: 'title images' },
      { path: 'offeredItem', select: 'title images' }
    ]);

    res.json(swapRequest);
  } catch (error) {
    console.error('Cancel swap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 