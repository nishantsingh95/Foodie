const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getDeliveryOrders, updateOrderStatus, getAllOrders, getMyDeliveries } = require('../controllers/orderController');
const { protect, delivery, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/delivery').get(protect, delivery, getDeliveryOrders); // Delivery specific
router.route('/my-deliveries').get(protect, delivery, getMyDeliveries); // Active deliveries for current delivery person
router.route('/all').get(protect, admin, getAllOrders); // Admin specific
router.route('/:id/status').put(protect, updateOrderStatus); // Shared by admin/delivery

module.exports = router;
