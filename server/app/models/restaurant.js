const Mongoose = require('mongoose');
const { Schema } = Mongoose;

// Mongoose.plugin(slug, options);

// Restaurant Schema
const RestaurantSchema = new Schema({
  email: {
    type: String,
    trim: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  user: {
    type: String
  },
  name: {
    type: String,
    trim: true,
    required: true
  },
  panNumber: {
    type: String,
    trime: true,
  },
  aadharNumber: {
     type: String,
     trime: true
  },
  accountNumber: {
    type: String,
    trime: true
  },
  ifscCode: {
     type:String,
     trime: true
  },
  fssaiRegistrationNumber:{
    type: String,
    trime: true
  },
  contactNumber:{
    type:String,
    trime: true
  },
  rating: {
    type: Number,
    maxLength: 2
  },
  geometry: {
    latitude: { type: String },
    longitude: { type: String }
  },
  avgCost: {
    maxLength: 4,
    type: Number,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    },
    default: 0
  },
  avgTime: {
    maxLength: 4,
    type: String,
    default: 0
  },
  image: {
    type: String,
    default: null
  },
  description: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVegOnly: {
    type: Boolean,
    default: false
  },
  categories: {
    type: Array,
    default: []
  },
  cuisines: {
    type: Array,
    default: []
  },
  items: {
    type: Array,
    default: []
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = Mongoose.model('Restaurant', RestaurantSchema);
