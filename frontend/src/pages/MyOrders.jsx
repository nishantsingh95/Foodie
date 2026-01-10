import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config/api';
import './Tracking.css'; // Reuse tracking CSS for consistency

const MyOrders = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                };
                const res = await axios.get(`${API_URL}/api/orders/myorders`, config);
                setOrders(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        if (user) fetchOrders();
    }, [user]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return '#f39c12';
            case 'Prepared': return '#3498db';
            case 'Out for Delivery': return '#e67e22';
            case 'Delivered':
            case 'Completed': return '#2ecc71';
            default: return '#95a5a6';
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="my-orders-container">
                <h1 style={{ color: 'var(--text)', marginBottom: '2rem', textAlign: 'center' }}>My Orders</h1>
                <div className="orders-grid">
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <div key={order._id} className="glass order-card">
                                <div className="order-header">
                                    <h3 style={{ margin: 0, color: '#ffa502' }}>Order #{order._id.slice(-6)}</h3>
                                    <span
                                        className="order-status"
                                        style={{ backgroundColor: getStatusColor(order.status), color: '#fff' }}
                                    >
                                        {order.status}
                                    </span>
                                </div>

                                <div className="order-items-list">
                                    {order.orderItems.map((item, index) => (
                                        <p key={index}>{item.qty} x {item.name}</p>
                                    ))}
                                </div>

                                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: '10px' }}>
                                    <p style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: 'var(--text)' }}>
                                        <span>Total Amount:</span>
                                        <span>₹{order.totalPrice}</span>
                                    </p>
                                </div>

                                {order.status !== 'Delivered' && order.status !== 'Completed' && (
                                    <button
                                        onClick={() => navigate(`/track/${order._id}`)}
                                        className="track-order-btn"
                                    >
                                        Track Order
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p style={{ color: '#aaa', textAlign: 'center', gridColumn: '1/-1' }}>You have no orders yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyOrders;
