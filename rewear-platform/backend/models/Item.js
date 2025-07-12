const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  images: [{
    type: String,
    required: [true, 'Please provide at least one image']
  }],
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories', 'other']
  },
  type: {
    type: String,
    required: [true, 'Please provide a type'],
    enum: ['men', 'women', 'kids', 'unisex']
  },
  size: {
    type: String,
    required: [true, 'Please provide a size'],
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size']
  },
  condition: {
    type: String,
    required: [true, 'Please provide condition'],
    enum: ['new', 'like-new', 'good', 'fair', 'poor']
  },
  tags: [{
    type: String,
    trim: true
  }],
  pointValue: {
    type: Number,
    required: [true, 'Please provide point value'],
    min: [1, 'Point value must be at least 1']
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'swapped', 'redeemed'],
    default: 'pending'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  location: {
    city: String,
    state: String,
    country: String
  },
  brand: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  material: {
    type: String,
    trim: true
  },
  season: {
    type: String,
    enum: ['spring', 'summer', 'fall', 'winter', 'all-season']
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better search performance
itemSchema.index({ title: 'text', description: 'text', tags: 'text' });
itemSchema.index({ category: 1, type: 1, status: 1 });
itemSchema.index({ uploader: 1, status: 1 });

// Virtual for like count
itemSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Ensure virtual fields are serialized
itemSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Item', itemSchema); 