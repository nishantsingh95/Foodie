const express = require('express');
const { getFoods, getMyFoods, addFood, deleteFood, updateFood, getFoodsByShop } = require('../controllers/foodController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getFoods).post(protect, admin, addFood);
router.get('/myfoods', protect, admin, getMyFoods);
router.get('/shop/:id', getFoodsByShop);
router.route('/:id').delete(protect, admin, deleteFood).put(protect, admin, updateFood);

module.exports = router;
