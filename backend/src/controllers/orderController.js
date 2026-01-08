const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    const {
        orderItems,
        totalPrice,
        deliveryLocation,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            totalPrice,
            deliveryLocation,
        });

        const createdOrder = await order.save();

        // Emit event
        const io = req.app.get('io');
        io.emit('new_order', createdOrder);

        res.status(201).json(createdOrder);
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
};

// @desc    Get all orders (for delivery/admin) - Filtering for available orders
// @route   GET /api/orders/delivery
// @access  Private/Delivery
const getDeliveryOrders = async (req, res) => {
    // Delivery person sees 'Prepared' orders (available) or orders they have been assigned
    const orders = await Order.find({
        $or: [
            { status: 'Prepared' }, // Available for pickup
            { deliveryPerson: req.user._id } // Assigned to me
        ]
    }).populate('user', 'name address').sort({ createdAt: -1 });
    res.json(orders);
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Delivery/Admin
const updateOrderStatus = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = req.body.status || order.status;
        if (req.body.deliveryPerson) {
            order.deliveryPerson = req.body.deliveryPerson;
        }

        // Auto-assign delivery person when they accept (Driver Assigned or Accepted)
        if ((req.body.status === 'Accepted' || req.body.status === 'Driver Assigned') && req.user.role === 'delivery') {
            order.deliveryPerson = req.user._id;
        }

        const updatedOrder = await order.save();

        // Populate order data before emitting
        const populatedOrder = await Order.findById(updatedOrder._id)
            .populate('user', 'name email')
            .populate('deliveryPerson', 'name email');

        // Emit event
        const io = req.app.get('io');
        console.log(`📡 Emitting order_updated event for order ${populatedOrder._id} with status: ${populatedOrder.status}`);
        io.emit('order_updated', populatedOrder);
        io.emit(`order_updated_${populatedOrder._id}`, populatedOrder); // specific order channel

        res.json(populatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/all
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    const orders = await Order.find({})
        .populate('user', 'id name email address')
        .sort({ createdAt: -1 });
    res.json(orders);
};

// @desc    Get active deliveries for current delivery person
// @route   GET /api/orders/my-deliveries
// @access  Private/Delivery
const getMyDeliveries = async (req, res) => {
    try {
        const orders = await Order.find({
            deliveryPerson: req.user._id,
            status: { $in: ['Driver Assigned', 'Out for Delivery'] }
        })
            .populate('user', 'name address')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching my deliveries:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { addOrderItems, getMyOrders, getDeliveryOrders, updateOrderStatus, getAllOrders, getMyDeliveries };
