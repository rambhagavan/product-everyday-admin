const Mongoose = require('mongoose');
const { Schema } = Mongoose;

// Product Schema
const ProductSchema = new Schema({
  sku: {
    type: String
  },
  name: {
    type: String,
    trim: true,
    required: true
  },
  slug: {
    type: String
  },
  image: {
    type: String,
    default: null
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    default: null
  },
  quantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0
  },
  weight: {
    type: Number,
    default: 0
  },
  taxable: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  images: {
    type: Array,
    default: []
  },
  tags: {
    type: Array,
    default: []
  },
  optionTypes: {
    type: Array,
    default: []
  },
  variants: {
    type: Array,
    default: []
  },
  brand: {
    type: String,
    default: null
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = Mongoose.model('Product', ProductSchema);
