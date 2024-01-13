const Mongoose = require('mongoose');
const { ORDER_ITEM_STATUS } = require('../constants/index.js');
const { Schema } = Mongoose;

// Order Schema
const OrderSchema = new Schema({
  products: [{
    product: Mongoose.Schema.Types.objectId,
    count: Number
  }],
  paymentIntent: {

  },
  orderStatus: {
    type: String,
    enum: ORDER_ITEM_STATUS
  },
  orderBy:Mongoose.Schema.Types.objectId,
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
}
);

module.exports = Mongoose.model('Order', OrderSchema);
