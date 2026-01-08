const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { updateDeliveryLocation, getOrderTracking } = require('../controllers/trackingController');

// Update delivery person location
router.put('/:id/location', protect, updateDeliveryLocation);

// Get order tracking details
router.get('/:id/tracking', protect, getOrderTracking);

module.exports = router;
