const express = require('express');
const { getShop, updateShop, getAllShops } = require('../controllers/shopController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, admin, getShop).post(protect, admin, updateShop);
router.get('/all', getAllShops);

module.exports = router;
