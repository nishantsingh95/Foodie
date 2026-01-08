const express = require('express');
const { getFoods, addFood, deleteFood, updateFood } = require('../controllers/foodController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getFoods).post(protect, admin, addFood);
router.route('/:id').delete(protect, admin, deleteFood).put(protect, admin, updateFood);

module.exports = router;
