import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaClock, FaMotorcycle, FaMapMarkerAlt, FaBoxOpen } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AccessDenied from '../components/AccessDenied';
import API_URL from '../config/api';
import './Delivery.css';

const DeliveryDashboard = () => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('available');
    const socketRef = useRef(null);
    const locationIntervalRef = useRef(null);

    const fetchOrders = async () => {
        try {
            console.log('🔍 Fetching delivery orders...');
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            };
            const res = await axios.get(`${API_URL}/api/orders/delivery`, config);
            console.log('📦 Received', res.data.length, 'orders from backend');
            setOrders(res.data);
        } catch (err) {
            console.error('❌ Error fetching orders:', err);
        }
    };

    useEffect(() => {
        // Initialize socket connection ONLY ONCE
        if (!socketRef.current) {
            console.log('🔌 Creating NEW Delivery socket connection...');
            socketRef.current = io(API_URL, {
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5,
                forceNew: false
            });
        }

        const socket = socketRef.current;

        // Listen for order events
        const handleNewOrder = (order) => {
            console.log('🔔 New order received:', order);
            toast.info('New order available!');
            fetchOrders();
        };

        const handleOrderUpdate = (updatedOrder) => {
            console.log('🔄 Order updated:', updatedOrder);
            fetchOrders();
        };

        socket.on('new_order', handleNewOrder);
        socket.on('order_updated', handleOrderUpdate);

        return () => {
            socket.off('new_order', handleNewOrder);
            socket.off('order_updated', handleOrderUpdate);
        };
    }, []);

    // Separate effect for fetching orders when user changes
    useEffect(() => {
        if (user && user.role === 'delivery') {
            fetchOrders();
        }
    }, [user]);

    // Location sharing for active deliveries
    useEffect(() => {
        const shareLocation = async () => {
            if ('geolocation' in navigator && orders.length > 0) {
                // Get active deliveries
                const myOrders = orders.filter(o => o.deliveryPerson?._id === user?._id || o.deliveryPerson === user?._id);
                const activeDeliveries = myOrders.filter(o => ['Driver Assigned', 'Out for Delivery'].includes(o.status));

                if (activeDeliveries.length > 0) {
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            const { latitude, longitude } = position.coords;
                            console.log(`📍 Current location: ${latitude}, ${longitude}`);

                            // Update location for all active deliveries
                            for (const order of activeDeliveries) {
                                try {
                                    const config = {
                                        headers: {
                                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                                        },
                                    };
                                    await axios.put(
                                        `${API_URL}/api/tracking/${order._id}/location`,
                                        { lat: latitude, lng: longitude },
                                        config
                                    );
                                } catch (err) {
                                    console.error('❌ Error sharing location:', err);
                                }
                            }
                        },
                        (error) => {
                            console.error('❌ Geolocation error:', error);
                        },
                        {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 0,
                        }
                    );
                }
            }
        };

        // Start location sharing if there are orders
        const myOrders = orders.filter(o => o.deliveryPerson?._id === user?._id || o.deliveryPerson === user?._id);
        const activeDeliveries = myOrders.filter(o => ['Driver Assigned', 'Out for Delivery'].includes(o.status));

        if (activeDeliveries.length > 0) {
            shareLocation();
            locationIntervalRef.current = setInterval(shareLocation, 10000);
        } else {
            if (locationIntervalRef.current) {
                clearInterval(locationIntervalRef.current);
                locationIntervalRef.current = null;
            }
        }

        return () => {
            if (locationIntervalRef.current) {
                clearInterval(locationIntervalRef.current);
            }
        };
    }, [orders, user]);


    const updateStatus = async (id, status) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            };

            await axios.put(`${API_URL}/api/orders/${id}/status`, {
                status,
                deliveryPerson: user._id
            }, config);

            toast.success(`Order status: ${status}`);
            fetchOrders();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const availableOrders = orders.filter(o => o.status === 'Prepared');
    const myOrders = orders.filter(o => o.deliveryPerson?._id === user?._id || o.deliveryPerson === user?._id);

    // Active: Driver Assigned, Out for Delivery, Delivered (waiting for completion)
    const activeDeliveries = myOrders.filter(o => ['Driver Assigned', 'Out for Delivery', 'Delivered'].includes(o.status));
    const completedHistory = myOrders.filter(o => o.status === 'Completed');

    if (loading) return <div style={{ minHeight: '100vh', backgroundColor: '#1e272e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
    if (!user || user.role !== 'delivery') return <AccessDenied />;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#1e272e', color: '#fff', paddingBottom: '2rem' }}>
            <Navbar />
            <div className="delivery-dashboard">

                <div className="welcome-banner">
                    <div className="welcome-text">
                        <h1>Welcome, {user?.name}! 👋</h1>
                        <p>Drive safe and earn more!</p>
                        {activeDeliveries.length > 0 && (
                            <div className="location-sharing-badge">
                                <span className="pulse" style={{ width: '8px', height: '8px', background: '#2ed573', borderRadius: '50%', display: 'inline-block', marginRight: '8px' }}></span>
                                Location sharing active for {activeDeliveries.length} {activeDeliveries.length === 1 ? 'delivery' : 'deliveries'}
                            </div>
                        )}
                    </div>
                    <div className="stat-card">
                        <FaMotorcycle size={24} color="#ffa502" />
                        <div>
                            <span className="stat-number">{activeDeliveries.length}</span>
                            <span className="stat-label">Active Jobs</span>
                        </div>
                    </div>
                </div>

                <div className="dashboard-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'available' ? 'active' : ''}`}
                        onClick={() => setActiveTab('available')}
                    >
                        Available Orders ({availableOrders.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'my_orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('my_orders')}
                    >
                        My Deliveries ({activeDeliveries.length})
                    </button>
                </div>

                <div className="content-area">
                    {activeTab === 'available' && (
                        <div>
                            <h2 className="delivery-section-title"><FaMapMarkerAlt /> Available Nearby</h2>
                            {availableOrders.length === 0 ? (
                                <p style={{ color: '#777', fontStyle: 'italic' }}>No orders ready for pickup right now.</p>
                            ) : (
                                <div className="delivery-grid">
                                    {availableOrders.map(order => (
                                        <div key={order._id} className="delivery-card">
                                            <div className="card-header">
                                                <span className="order-id">#{order._id.slice(-6)}</span>
                                                <span className="order-price">${order.totalPrice}</span>
                                            </div>
                                            <div className="card-body">
                                                <p><span className="card-label">Pickup:</span> {order.restaurant || 'Foodie Kitchen'}</p>
                                                <p><span className="card-label">Dropoff:</span> {order.deliveryLocation?.address || order.user?.address || 'Address not provided'}</p>
                                                <p style={{ color: '#2ed573', marginTop: '10px', fontWeight: 'bold', flexDirection: 'row', alignItems: 'center', gap: '5px' }}>
                                                    <FaCheckCircle /> Ready for Pickup
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => updateStatus(order._id, 'Driver Assigned')}
                                                className="accept-btn"
                                            >
                                                Accept Order
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'my_orders' && (
                        <div>
                            <h2 className="delivery-section-title"><FaBoxOpen /> Active Jobs</h2>
                            {activeDeliveries.length === 0 && <p style={{ color: '#777', marginBottom: '2rem' }}>No active jobs.</p>}
                            <div className="delivery-grid">
                                {activeDeliveries.map(order => (
                                    <div key={order._id} className="delivery-card" style={{ borderLeft: `4px solid ${getStatusColor(order.status)}` }}>
                                        <div className="card-header">
                                            <span className="order-id">#{order._id.slice(-6)}</span>
                                            <span style={{ color: getStatusColor(order.status), fontWeight: 'bold' }}>
                                                {order.status === 'Driver Assigned' ? 'Waiting Owner' : order.status}
                                            </span>
                                        </div>
                                        <div className="card-body">
                                            <p><span className="card-label">Customer:</span> {order.user?.name}</p>
                                            <p><span className="card-label">Address:</span> {order.deliveryLocation?.address || order.user?.address || 'Address not provided'}</p>
                                        </div>

                                        {/* Logic for Buttons based on flow */}
                                        <div style={{ marginTop: '15px' }}>
                                            {order.status === 'Driver Assigned' && (
                                                <div className="waiting-box">
                                                    <FaClock /> Waiting for Owner to Dispatch...
                                                </div>
                                            )}

                                            {order.status === 'Out for Delivery' && (
                                                <div className="action-buttons">
                                                    <button
                                                        onClick={() => navigate(`/track/${order._id}`)}
                                                        className="track-btn"
                                                    >
                                                        View Map
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(order._id, 'Delivered')}
                                                        className="complete-btn"
                                                    >
                                                        Mark Delivered
                                                    </button>
                                                </div>
                                            )}

                                            {order.status === 'Delivered' && (
                                                <button
                                                    onClick={() => updateStatus(order._id, 'Completed')}
                                                    className="complete-btn"
                                                    style={{ width: '100%', marginTop: '10px', backgroundColor: '#70a1ff' }}
                                                >
                                                    Finish & Complete Job
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Completed History Section */}
                            {completedHistory.length > 0 && (
                                <>
                                    <h2 className="delivery-section-title" style={{ marginTop: '3rem' }}><FaCheckCircle /> Completed Jobs (Today)</h2>
                                    <div className="delivery-grid">
                                        {completedHistory.slice(0, 5).map(order => (
                                            <div key={order._id} className="delivery-card" style={{ opacity: 0.6 }}>
                                                <div className="card-header">
                                                    <span className="order-id">#{order._id.slice(-6)}</span>
                                                    <span style={{ color: '#2ed573' }}>Completed</span>
                                                </div>
                                                <p style={{ fontSize: '0.8rem', color: '#aaa' }}>
                                                    {new Date(order.updatedAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const getStatusColor = (status) => {
    switch (status) {
        case 'Driver Assigned': return '#ffa502';
        case 'Out for Delivery': return '#1e90ff';
        case 'Delivered': return '#2ed573';
        default: return '#fff';
    }
};

export default DeliveryDashboard;
