import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TrackingMap from '../components/TrackingMap';
import { FaShoppingBag, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import API_URL from '../config/api';

const MyOrders = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

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

    return (
        <>
            <Navbar />
            <div className="my-orders-page" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '2rem', textAlign: 'center', color: '#ffa502' }}>My Orders</h1>
                {orders.length === 0 ? (
                    <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
                        <p>No orders found.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {orders.map((order) => (
                            <div key={order._id} className="glass" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3>Order #{order._id.substring(0, 8)}</h3>
                                    <p style={{ color: '#aaa', margin: '5px 0' }}>Total: ${order.totalPrice}</p>
                                    <p>Status: <span style={{ color: order.status === 'Delivered' ? '#ff4757' : '#2ed573' }}>{order.status}</span></p>

                                    {order.status !== 'Pending' && order.status !== 'Cancelled' && (
                                        <Link to={`/track/${order._id}`} style={{ display: 'inline-block', marginTop: '10px', color: '#1e90ff', textDecoration: 'none', fontWeight: 'bold' }}>
                                            Track Order &rarr;
                                        </Link>
                                    )}
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.9rem', color: '#ccc' }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default MyOrders;
