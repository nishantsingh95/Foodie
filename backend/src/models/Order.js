const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            food: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Food',
            },
        },
    ],
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    status: {
        type: String,
        required: true,
        default: 'Pending',
        enum: ['Pending', 'Accepted', 'Cooking', 'Prepared', 'Driver Assigned', 'Out for Delivery', 'Delivered', 'Completed', 'Cancelled'],
    },
    deliveryPerson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    deliveryLocation: {
        address: { type: String },
        lat: { type: Number },
        lng: { type: Number },
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'upi'],
        default: 'cod',
    },
    upiId: {
        type: String,
    },
    deliveryPersonLocation: {
        lat: { type: Number },
        lng: { type: Number },
        lastUpdated: { type: Date },
    },
    estimatedDeliveryTime: {
        type: Date,
    },
    trackingHistory: [{
        lat: { type: Number },
        lng: { type: Number },
        timestamp: { type: Date, default: Date.now },
    }],
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
