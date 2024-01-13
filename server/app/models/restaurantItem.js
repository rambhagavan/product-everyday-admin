const Mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const { Schema } = Mongoose;

const options = {
  separator: '-',
  lang: 'en',
  truncate: 120
};

// Mongoose.plugin(slug, options);

// Restaurant Schema
const RestaurantItemSchema = new Schema({
  restaurantId: {
    type: String
  },
  name: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    maxLength: 2
  },
  image :{
    type: String,
  },
  images: {
    type: Array,
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVeg: {
    type: Boolean,
    default: false
  },
  categories: {
    type: Array,
    default: []
  },
  price: {
    type: Number,
    default: 0
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = Mongoose.model('RestaurantItem', RestaurantItemSchema);
