const Food = require('../models/Food');
const Shop = require('../models/Shop');

// @desc    Get all food items (Public)
// @route   GET /api/food
// @access  Public
const getFoods = async (req, res) => {
    try {
        const foods = await Food.find({});
        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged-in owner's food items
// @route   GET /api/food/myfoods
// @access  Private/Admin
const getMyFoods = async (req, res) => {
    try {
        // Find foods explicitly owned by this user
        const foods = await Food.find({ owner: req.user._id });
        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a food item
// @route   POST /api/food
// @access  Private/Admin
const addFood = async (req, res) => {
    const { name, description, price, category, image, available, isVeg, rating } = req.body;

    try {
        // Securely fetch shop name instead of trusting body
        const shop = await Shop.findOne({ user: req.user._id });

        const food = new Food({
            name,
            description,
            price,
            category,
            image,
            available,
            isVeg,
            rating: rating || 4.5,
            restaurant: shop ? shop.name : 'Unknown Shop',
            owner: req.user._id // Direct stable link to creator
        });

        const createdFood = await food.save();
        res.status(201).json(createdFood);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a food item
// @route   DELETE /api/food/:id
// @access  Private/Admin
const deleteFood = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);

        if (food) {
            // Verify ownership
            if (food.owner.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to delete this item' });
            }

            await food.deleteOne();
            res.json({ message: 'Food removed' });
        } else {
            res.status(404).json({ message: 'Food not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a food item
// @route   PUT /api/food/:id
// @access  Private/Admin
const updateFood = async (req, res) => {
    const { name, description, price, category, image, available, isVeg, rating } = req.body;

    try {
        const food = await Food.findById(req.params.id);

        if (food) {
            // Verify ownership
            if (food.owner.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to update this item' });
            }

            food.name = name || food.name;
            food.description = description || food.description;
            food.price = price || food.price;
            food.category = category || food.category;
            food.image = image || food.image;
            food.available = available !== undefined ? available : food.available;
            food.isVeg = isVeg !== undefined ? isVeg : food.isVeg;
            food.rating = rating || food.rating;

            const updatedFood = await food.save();
            res.json(updatedFood);
        } else {
            res.status(404).json({ message: 'Food not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getFoods, getMyFoods, addFood, deleteFood, updateFood };
