const Mongoose = require('mongoose');
const { ORDER_ITEM_STATUS } = require('../constants/index.js');
const { Schema } = Mongoose;

// Order Schema
const OrderSchema = new Schema({
  user: {
    userId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  orderItems: [{
    productId: {type: Schema.Types.ObjectId},
    productName: {type: String},
    productType: {type: String},
    quantity: { type: Number},
    price: { type: Number}
  }],
  totalItems: { type: Number, required: true},
  totalCartPrice: { type: Number, required: true},
  deliveryAddressInfo: {
    address:{ type: String, required: true },
    city: { type: String, required: true, default: 'Bangalore' },
    postalCode: { type: Number, required: true, default: '000000'},
    country: { type: String, required: true , default: 'India'}
  },
  paymentIntent: {
    id: { type: String},
    status: { type: String}
  },
  deliveryCharge: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  orderStatus: {
    type: String,
    enum: ORDER_ITEM_STATUS
  },
  deliveredAt: Date,
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
}
);

module.exports = Mongoose.model('Order', OrderSchema);
