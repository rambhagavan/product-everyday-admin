const Mongoose = require('mongoose');
const { Schema } = Mongoose;

const GeometrySchema = new Schema({
  latitude:{
    type: String
  },
  longitude:{
    type: String
  }
}
)

// Address Schema
const AddressSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true
  },
  address: {
    type: String,
  },
  landmark: {
    type: String,
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  country: {
    type: String
  },
  zipCode: {
    type: String
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  geometry:{
    type:GeometrySchema, 
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = Mongoose.model('Address', AddressSchema);
