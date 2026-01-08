import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaClock, FaMotorcycle, FaMapMarkerAlt, FaBox, FaPhone } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AccessDenied from '../components/AccessDenied';
import API_URL from '../config/api';

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
                    Authorization: `Bearer ${localStorage.getItem('token')} `,
                },
            };
            const res = await axios.get(`${API_URL} /api/orders / delivery`, config);
            console.log('📦 Received', res.data.length, 'orders from backend');
            console.log('📦 Orders:', res.data);
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
                forceNew: false // Don't create new connection if one exists
            });
        } else {
            console.log('♻️ Reusing existing Delivery socket connection');
        }

        const socket = socketRef.current;

        // Socket connection logging
        const handleConnect = () => {
            console.log('✅ Delivery Socket connected to server');
        };

        const handleDisconnect = () => {
            console.log('❌ Delivery Socket disconnected from server');
        };

        const handleConnectError = (error) => {
            console.error('🔴 Socket connection error:', error);
        };

        // Listen for order events
        const handleNewOrder = (order) => {
            console.log('🔔 New order received:', order);
            toast.info('New order available!');
            fetchOrders();
        };

        const handleOrderUpdate = (updatedOrder) => {
            console.log('🔄 Order updated:', updatedOrder);
            console.log('🔄 Triggering fetchOrders...');
            fetchOrders();
        };

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('connect_error', handleConnectError);
        socket.on('new_order', handleNewOrder);
        socket.on('order_updated', handleOrderUpdate);

        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('connect_error', handleConnectError);
            socket.off('new_order', handleNewOrder);
            socket.off('order_updated', handleOrderUpdate);
        };
    }, []); // Empty dependency array - only run once on mount

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
                            console.log(`📍 Current location: ${latitude}, ${longitude} `);

                            // Update location for all active deliveries
                            for (const order of activeDeliveries) {
                                try {
                                    const config = {
                                        headers: {
                                            Authorization: `Bearer ${localStorage.getItem('token')} `,
                                        },
                                    };
                                    await axios.put(
                                        `${API_URL} /api/tracking / ${order._id}/location`,
                                        { lat: latitude, lng: longitude },
                                        config
                                    );
                                    console.log(`✅ Location updated for order ${order._id}`);
                                } catch (err) {
                                    console.error('❌ Error sharing location:', err);
                                }
                            }
                        },
                        (error) => {
                            console.error('❌ Geolocation error:', error);
                            if (error.code === error.PERMISSION_DENIED) {
                                toast.error('Location permission denied. Please enable location access in your browser settings.');
                            }
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
            console.log(`🚀 Starting location sharing for ${activeDeliveries.length} active deliveries`);
            // Share location immediately
            shareLocation();
            // Then every 10 seconds
            locationIntervalRef.current = setInterval(shareLocation, 10000);
        } else {
            // Clear interval if no active deliveries
            if (locationIntervalRef.current) {
                console.log('⏹️ Stopping location sharing - no active deliveries');
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

    // Add loading and access checks
    if (loading) return <div style={{ minHeight: '100vh', backgroundColor: '#1e272e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
    if (!user || user.role !== 'delivery') return <AccessDenied />;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#1e272e', color: '#fff', paddingBottom: '2rem' }}>
            <Navbar />
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>

                <div style={styles.welcomeBanner}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '2rem' }}>Welcome, {user?.name}! 👋</h1>
                        <p style={{ color: '#ccc', marginTop: '5px' }}>Drive safe and earn more!</p>
                        {activeDeliveries.length > 0 && (
                            <div style={styles.locationSharingBadge}>
                                <span className="pulse" style={{ width: '8px', height: '8px', background: '#2ed573', borderRadius: '50%', display: 'inline-block', marginRight: '8px' }}></span>
                                Location sharing active for {activeDeliveries.length} {activeDeliveries.length === 1 ? 'delivery' : 'deliveries'}
                            </div>
                        )}
                    </div>
                    <div style={styles.statCard}>
                        <FaMotorcycle size={24} color="#ffa502" />
                        <div>
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{activeDeliveries.length}</span>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: '#aaa' }}>Active Jobs</span>
                        </div>
                    </div>
                </div>

                <div style={styles.tabs}>
                    <button
                        style={activeTab === 'available' ? styles.activeTab : styles.tab}
                        onClick={() => setActiveTab('available')}
                    >
                        Available Orders ({availableOrders.length})
                    </button>
                    <button
                        style={activeTab === 'my_orders' ? styles.activeTab : styles.tab}
                        onClick={() => setActiveTab('my_orders')}
                    >
                        My Deliveries ({activeDeliveries.length})
                    </button>
                </div>

                <div style={styles.contentArea}>
                    {activeTab === 'available' && (
                        <div>
                            <h2 style={styles.sectionTitle}><FaMapMarkerAlt /> Available Nearby</h2>
                            {availableOrders.length === 0 ? (
                                <p style={{ color: '#777', fontStyle: 'italic' }}>No orders ready for pickup right now.</p>
                            ) : (
                                <div style={styles.grid}>
                                    {availableOrders.map(order => (
                                        <div key={order._id} style={styles.card}>
                                            <div style={styles.cardHeader}>
                                                <span style={styles.orderId}>#{order._id.slice(-6)}</span>
                                                <span style={styles.price}>${order.totalPrice}</span>
                                            </div>
                                            <div style={styles.cardBody}>
                                                <p><strong>Pickup:</strong> {order.restaurant || 'Foodie Kitchen'}</p>
                                                <p><strong>Dropoff:</strong> {order.deliveryLocation?.address || order.user?.address || 'Address not provided'}</p>
                                                <p style={{ color: '#2ed573', fontSize: '0.9rem', marginTop: '10px', fontWeight: 'bold' }}>
                                                    <FaCheckCircle style={{ marginRight: '5px' }} /> Ready for Pickup
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => updateStatus(order._id, 'Driver Assigned')}
                                                style={styles.acceptBtn}
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
                            <h2 style={styles.sectionTitle}><FaBoxOpen /> Active Jobs</h2>
                            {activeDeliveries.length === 0 && <p style={{ color: '#777', marginBottom: '2rem' }}>No active jobs.</p>}
                            <div style={styles.grid}>
                                {activeDeliveries.map(order => (
                                    <div key={order._id} style={{ ...styles.card, borderLeft: getBorderColor(order.status) }}>
                                        <div style={styles.cardHeader}>
                                            <span style={styles.orderId}>#{order._id.slice(-6)}</span>
                                            <span style={{ color: getStatusColor(order.status), fontWeight: 'bold' }}>
                                                {order.status === 'Driver Assigned' ? 'Waiting Owner' : order.status}
                                            </span>
                                        </div>
                                        <div style={styles.cardBody}>
                                            <p><strong>Customer:</strong> {order.user?.name}</p>
                                            <p><strong>Address:</strong> {order.deliveryLocation?.address || order.user?.address || 'Address not provided'}</p>
                                        </div>

                                        {/* Logic for Buttons based on flow */}
                                        <div style={{ marginTop: '15px' }}>
                                            {order.status === 'Driver Assigned' && (
                                                <div style={styles.waitingBox}>
                                                    <FaClock /> Waiting for Owner to Dispatch...
                                                </div>
                                            )}

                                            {order.status === 'Out for Delivery' && (
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button
                                                        onClick={() => navigate(`/track/${order._id}`)}
                                                        style={styles.trackBtn}
                                                    >
                                                        View Map
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(order._id, 'Delivered')}
                                                        style={styles.completeBtn}
                                                    >
                                                        Mark Delivered
                                                    </button>
                                                </div>
                                            )}

                                            {order.status === 'Delivered' && (
                                                <button
                                                    onClick={() => updateStatus(order._id, 'Completed')}
                                                    style={{ ...styles.completeBtn, backgroundColor: '#70a1ff' }}
                                                >
                                                    Finish & Complete Job
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Completed History Section (Optional, showing last few) */}
                            {completedHistory.length > 0 && (
                                <>
                                    <h2 style={{ ...styles.sectionTitle, marginTop: '3rem' }}><FaCheckCircle /> Completed Jobs (Today)</h2>
                                    <div style={styles.grid}>
                                        {completedHistory.slice(0, 5).map(order => (
                                            <div key={order._id} style={{ ...styles.card, opacity: 0.6 }}>
                                                <div style={styles.cardHeader}>
                                                    <span style={styles.orderId}>#{order._id.slice(-6)}</span>
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

const getBorderColor = (status) => {
    return `4px solid ${getStatusColor(status)}`;
}

const styles = {
    // ... (keeping mostly same styles, updated waitingBox)
    welcomeBanner: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '2rem',
        background: 'linear-gradient(to right, #2f3542, #3a4b5c)',
        borderRadius: '15px',
        marginBottom: '2rem',
        border: '1px solid rgba(255,255,255,0.05)',
    },
    statCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        background: 'rgba(0,0,0,0.2)',
        padding: '10px 20px',
        borderRadius: '10px',
    },
    tabs: {
        display: 'flex',
        gap: '20px',
        marginBottom: '2rem',
        borderBottom: '1px solid #444',
        paddingBottom: '10px',
    },
    tab: {
        background: 'none',
        border: 'none',
        color: '#aaa',
        fontSize: '1.1rem',
        cursor: 'pointer',
        padding: '10px',
        transition: 'color 0.2s',
    },
    activeTab: {
        background: 'none',
        border: 'none',
        color: '#ffa502',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        padding: '10px',
        borderBottom: '2px solid #ffa502',
    },
    sectionTitle: {
        color: '#fff',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '1.3rem',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid rgba(255,255,255,0.05)',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1rem',
    },
    orderId: {
        fontWeight: 'bold',
        color: '#ccc',
    },
    price: {
        color: '#ffa502',
        fontWeight: 'bold',
    },
    cardBody: {
        color: '#ddd',
        fontSize: '0.95rem',
    },
    acceptBtn: {
        width: '100%',
        marginTop: '1.5rem',
        padding: '12px',
        backgroundColor: '#ffa502',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    trackBtn: {
        flex: 1,
        padding: '10px',
        backgroundColor: '#1e90ff',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    completeBtn: {
        flex: 1,
        padding: '10px',
        backgroundColor: '#2ed573',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    waitingBox: {
        padding: '10px',
        backgroundColor: 'rgba(255, 165, 2, 0.1)',
        border: '1px dashed #ffa502',
        color: '#ffa502',
        borderRadius: '8px',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
    },
    locationSharingBadge: {
        marginTop: '10px',
        padding: '8px 12px',
        background: 'rgba(46, 213, 115, 0.1)',
        border: '1px solid rgba(46, 213, 115, 0.3)',
        borderRadius: '20px',
        color: '#2ed573',
        fontSize: '0.85rem',
        display: 'inline-flex',
        alignItems: 'center',
    }
};

export default DeliveryDashboard;
