import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaClock, FaMotorcycle, FaBox } from 'react-icons/fa';
import API_URL from '../config/api';
import AccessDenied from '../components/AccessDenied';

const AdminOrders = () => {
    const { user, loading } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);
    const socketRef = useRef(null);

    const fetchOrders = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            const res = await axios.get(`${API_URL}/api/orders/all`, config);
            setOrders(res.data);
            setIsLoadingOrders(false);
        } catch (err) {
            console.error(err);
            toast.error('Error fetching orders');
            setIsLoadingOrders(false);
        }
    };

    useEffect(() => {
        // Initialize socket connection ONLY ONCE
        if (!socketRef.current) {
            console.log('🔌 Creating NEW Admin socket connection...');
            socketRef.current = io(API_URL, {
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5,
                forceNew: false
            });
        } else {
            console.log('♻️ Reusing existing Admin socket connection');
        }

        const socket = socketRef.current;

        // Socket connection logging
        const handleConnect = () => {
            console.log('✅ Admin Socket connected to server');
        };

        const handleDisconnect = () => {
            console.log('❌ Admin Socket disconnected from server');
        };

        const handleConnectError = (error) => {
            console.error('🔴 Admin Socket connection error:', error);
        };

        const handleNewOrder = (order) => {
            console.log('🔔 Admin: New Order Received!', order);
            toast.info('New Order Received!');
            fetchOrders();
        };

        const handleOrderUpdate = (updatedOrder) => {
            console.log('🔄 Admin: Order updated', updatedOrder);
            console.log('🔄 Admin: Triggering fetchOrders...');
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
        if (user && user.role === 'admin') {
            fetchOrders();
        }
    }, [user]);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            await axios.put(`${API_URL}/api/orders/${orderId}/status`, { status: newStatus }, config);
            toast.success(`Order status updated to ${newStatus}`);
            fetchOrders(); // Refresh
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!user || user.role !== 'admin') return <AccessDenied />;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#1e272e', color: '#fff' }}>
            <Navbar />
            <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ color: '#ffa502', marginBottom: '2rem' }}>All Customer Orders</h1>

                {isLoadingOrders ? (
                    <p>Loading orders...</p>
                ) : orders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {orders.map((order) => (
                            <div key={order._id} className="glass" style={{ padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                                    <div>
                                        <h3 style={{ margin: 0, color: '#ff4757' }}>Order #{order._id.substring(0, 8)}</h3>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#ccc' }}>
                                            Placed by: <span style={{ color: '#fff' }}>{order.user?.name || 'Unknown'}</span> on {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.2rem', color: '#2ed573' }}>${order.totalPrice}</p>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            marginBottom: '10px',
                                            backgroundColor: order.status === 'Delivered' ? '#2ed573' : (order.status === 'Cancelled' ? '#ff4757' : '#ffa502'),
                                            color: '#000',
                                            fontWeight: 'bold',
                                            fontSize: '0.8rem'
                                        }}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    {order.orderItems.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '5px' }}>
                                            <span>{item.qty} x {item.name}</span>
                                            <span>${item.qty * item.price}</span>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '5px' }}>
                                    <span style={{ fontSize: '0.9rem', color: '#aaa' }}>Delivery to: {order.deliveryLocation?.address || order.user?.address || 'Address not provided'}</span>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        {order.status !== 'Completed' && order.status !== 'Cancelled' && (
                                            <>
                                                {order.status === 'Pending' && (
                                                    <button onClick={() => handleStatusUpdate(order._id, 'Prepared')} style={{ ...styles.actionBtn, backgroundColor: '#ffa502' }}>Mark Prepared</button>
                                                )}

                                                {order.status === 'Prepared' && (
                                                    <span style={{ fontSize: '0.8rem', color: '#aaa', fontStyle: 'italic', padding: '5px' }}>Waiting for Driver...</span>
                                                )}

                                                {order.status === 'Driver Assigned' && (
                                                    <button onClick={() => handleStatusUpdate(order._id, 'Out for Delivery')} style={{ ...styles.actionBtn, backgroundColor: '#1e90ff' }}>Dispatch</button>
                                                )}

                                                {order.status === 'Out for Delivery' && (
                                                    <span style={{ fontSize: '0.8rem', color: '#1e90ff', fontStyle: 'italic', padding: '5px' }}>In Transit</span>
                                                )}

                                                {order.status === 'Delivered' && (
                                                    <span style={{ fontSize: '0.8rem', color: '#2ed573', fontStyle: 'italic', padding: '5px' }}>Delivered & waiting completion</span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    actionBtn: {
        padding: '5px 10px',
        border: 'none',
        borderRadius: '3px',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '0.8rem'
    }
};

export default AdminOrders;
