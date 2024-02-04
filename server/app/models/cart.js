const Mongoose = require('mongoose');
const { Schema } = Mongoose;

// Cart Schema
const CartSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true},
    cartItems: [{
        productId: {type: Schema.Types.ObjectId, required: true},
        productName: {type: String, required: true},
        productType: {type: String, required: true},
        quantity: { type: Number, required: true},
        price: { type: Number, required: true},
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
