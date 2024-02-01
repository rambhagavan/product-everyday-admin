const Mongoose = require('mongoose');
const { Schema } = Mongoose;

// Cart Schema
const CartSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true},
    cartItems: [{
        productId: {type: Schema.Types.ObjectId},
        productName: {type: String},
        productType: {type: String},
        quantity: { type: Number},
        price: { type: Number}
    }],
    totalItems: { type: Number, default: 0},
    totalAmount: { type: Number, default: 0},
    updated: Date,
    created: {
    type: Date,
    default: Date.now,
    }, 
}
);

module.exports = Mongoose.model('Cart', CartSchema);
