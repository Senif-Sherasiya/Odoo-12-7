const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'cancelled', 'completed'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['swap', 'redeem'],
    required: true
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  offeredItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  },
  pointsOffered: {
    type: Number,
    min: 0
  },
  acceptedAt: Date,
  declinedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reason: {
    type: String,
    maxlength: [200, 'Reason cannot be more than 200 characters']
  }
}, {
  timestamps: true
});

// Index for better query performance
swapRequestSchema.index({ fromUser: 1, status: 1 });
swapRequestSchema.index({ toUser: 1, status: 1 });
swapRequestSchema.index({ itemId: 1, status: 1 });

// Virtual for time since request
swapRequestSchema.virtual('timeSinceRequest').get(function() {
  return Date.now() - this.createdAt;
});

// Ensure virtual fields are serialized
swapRequestSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('SwapRequest', swapRequestSchema); 