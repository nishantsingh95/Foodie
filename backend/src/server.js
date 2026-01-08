const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require("socket.io");

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Vite frontend
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Make io accessible to our router
app.set('io', io);

const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes');
const shopRoutes = require('./routes/shopRoutes');
const trackingRoutes = require('./routes/trackingRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/tracking', trackingRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

io.on('connection', (socket) => {
    // Removed verbose connection log - only log important events

    // Handle joining tracking room for an order
    socket.on('join_tracking', (orderId) => {
        const roomName = `order_${orderId}`;
        socket.join(roomName);
        // Removed verbose log
    });

    // Handle leaving tracking room
    socket.on('leave_tracking', (orderId) => {
        const roomName = `order_${orderId}`;
        socket.leave(roomName);
        // Removed verbose log
    });

    socket.on('disconnect', () => {
        // Removed verbose disconnect log
    });

    // Handle location updates from delivery person (legacy support)
    socket.on('update_location', (data) => {
        // data: { orderId, location: { lat, lng } }
        const roomName = `order_${data.orderId}`;
        io.to(roomName).emit('location_update', {
            orderId: data.orderId,
            location: data.location,
            timestamp: new Date()
        });
        // Removed verbose location update log
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
