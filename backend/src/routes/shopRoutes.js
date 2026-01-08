const express = require('express');
const { getShop, updateShop } = require('../controllers/shopController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, admin, getShop).post(protect, admin, updateShop);

module.exports = router;
