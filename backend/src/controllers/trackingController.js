const Order = require('../models/Order');

// @desc    Update delivery person location
// @route   PUT /api/orders/:id/location
// @access  Private/Delivery
const updateDeliveryLocation = async (req, res) => {
    try {
        const { lat, lng } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify the delivery person is assigned to this order
        if (order.deliveryPerson.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this order location' });
        }

        // Update location
        order.deliveryPersonLocation = {
            lat,
            lng,
            lastUpdated: new Date(),
        };

        // Add to tracking history
        order.trackingHistory.push({
            lat,
            lng,
            timestamp: new Date(),
        });

        await order.save();

        // Emit socket event for real-time update
        const io = req.app.get('io');
        io.to(`order_${order._id}`).emit('location_update', {
            orderId: order._id,
            location: { lat, lng },
            timestamp: new Date(),
        });

        // Removed verbose console log

        res.json({
            success: true,
            location: order.deliveryPersonLocation,
        });
    } catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get order tracking details
// @route   GET /api/orders/:id/tracking
// @access  Private
const getOrderTracking = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name address')
            .populate('deliveryPerson', 'name phone');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is authorized (order owner, delivery person, or admin)
        const isAuthorized =
            order.user._id.toString() === req.user._id.toString() ||
            (order.deliveryPerson && order.deliveryPerson._id.toString() === req.user._id.toString()) ||
            req.user.role === 'admin';

        if (!isAuthorized) {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }

        res.json({
            orderId: order._id,
            status: order.status,
            deliveryLocation: order.deliveryLocation,
            deliveryPersonLocation: order.deliveryPersonLocation,
            estimatedDeliveryTime: order.estimatedDeliveryTime,
            trackingHistory: order.trackingHistory,
            deliveryPerson: order.deliveryPerson,
            user: order.user,
            orderItems: order.orderItems,
            totalPrice: order.totalPrice,
        });
    } catch (error) {
        console.error('Error getting tracking:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    updateDeliveryLocation,
    getOrderTracking,
};
