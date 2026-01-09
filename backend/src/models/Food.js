const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    isVeg: {
        type: Boolean,
        default: true,
    },
    rating: {
        type: Number,
        default: 4.5,
    },
    restaurant: {
        type: String,
        default: 'Foodie Kitchen',
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    available: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
