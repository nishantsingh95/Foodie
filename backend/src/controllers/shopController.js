const Shop = require('../models/Shop');

// @desc    Get current admin shop
// @route   GET /api/shop
// @access  Private/Admin
const getShop = async (req, res) => {
    try {
        const shop = await Shop.findOne({ user: req.user._id });
        if (shop) {
            res.json(shop);
        } else {
            res.status(404).json({ message: 'Shop not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register or Update Shop
// @route   POST /api/shop
// @access  Private/Admin
const updateShop = async (req, res) => {
    const { name, image, city, state, address } = req.body;

    try {
        let shop = await Shop.findOne({ user: req.user._id });

        if (shop) {
            // Update
            shop.name = name || shop.name;
            shop.image = image || shop.image;
            shop.city = city || shop.city;
            shop.state = state || shop.state;
            shop.address = address || shop.address;

            const updatedShop = await shop.save();
            res.json(updatedShop);
        } else {
            // Create
            shop = new Shop({
                user: req.user._id,
                name,
                image,
                city,
                state,
                address
            });

            const createdShop = await shop.save();
            res.status(201).json(createdShop);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all shops (Public)
// @route   GET /api/shop/all
// @access  Public
const getAllShops = async (req, res) => {
    try {
        const shops = await Shop.find({});
        res.json(shops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getShop, updateShop, getAllShops };
