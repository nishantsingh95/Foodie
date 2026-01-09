import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import API_URL from '../config/api';
import AccessDenied from '../components/AccessDenied';
import './Admin.css';

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
            socketRef.current = io(API_URL, {
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5,
                forceNew: false
            });
        }

        const socket = socketRef.current;

        const handleNewOrder = (order) => {
            console.log('🔔 Admin: New Order Received!', order);
            toast.info('New Order Received!');
            fetchOrders();
        };

        const handleOrderUpdate = (updatedOrder) => {
            console.log('🔄 Admin: Order updated', updatedOrder);
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
            <div className="admin-dashboard">
                <h1 className="admin-title" style={{ marginBottom: '2rem', color: '#ffa502' }}>All Customer Orders</h1>

                {isLoadingOrders ? (
                    <p>Loading orders...</p>
                ) : orders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    <div className="order-list-db">
                        {orders.map((order) => (
                            <div key={order._id} className="order-card-db">
                                <div className="order-header-db">
                                    <div>
                                        <h3 className="order-id-db">Order #{order._id.substring(0, 8)}</h3>
                                        <p className="order-user-info">
                                            Placed by: <span style={{ color: '#fff' }}>{order.user?.name || 'Unknown'}</span> on {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p className="order-price-db">${order.totalPrice}</p>
                                        <span className="order-status-badge" style={{
                                            backgroundColor: order.status === 'Delivered' ? '#2ed573' : (order.status === 'Cancelled' ? '#ff4757' : '#ffa502'),
                                        }}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="order-items-db">
                                    {order.orderItems.map((item, idx) => (
                                        <div key={idx} className="order-item-row">
                                            <span>{item.qty} x {item.name}</span>
                                            <span>${item.qty * item.price}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-footer-db">
                                    <span className="order-address">Delivery to: {order.deliveryLocation?.address || order.user?.address || 'Address not provided'}</span>
                                    <div className="order-actions-db">
                                        {order.status !== 'Completed' && order.status !== 'Cancelled' && (
                                            <>
                                                {order.status === 'Pending' && (
                                                    <button onClick={() => handleStatusUpdate(order._id, 'Prepared')} className="action-btn-db" style={{ backgroundColor: '#ffa502' }}>Mark Prepared</button>
                                                )}

                                                {order.status === 'Prepared' && (
                                                    <span style={{ fontSize: '0.8rem', color: '#aaa', fontStyle: 'italic', padding: '5px' }}>Waiting for Driver...</span>
                                                )}

                                                {order.status === 'Driver Assigned' && (
                                                    <button onClick={() => handleStatusUpdate(order._id, 'Out for Delivery')} className="action-btn-db" style={{ backgroundColor: '#1e90ff' }}>Dispatch</button>
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

export default AdminOrders;
