import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import LiveTrackingMap from '../components/LiveTrackingMap';
import { FaMapMarkerAlt, FaMotorcycle, FaStore, FaCheckCircle, FaClock, FaPhone } from 'react-icons/fa';
import { toast } from 'react-toastify';
import API_URL from '../config/api';
import './Tracking.css';

const TrackOrder = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [trackingData, setTrackingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deliveryPersonLocation, setDeliveryPersonLocation] = useState(null);
    const socketRef = useRef(null);

    useEffect(() => {
        fetchTrackingData();

        // Initialize socket for real-time updates
        if (!socketRef.current) {
            socketRef.current = io(API_URL);
        }

        const socket = socketRef.current;

        // Join tracking room for this order
        socket.emit('join_tracking', id);

        // Listen for location updates
        socket.on('location_update', (data) => {
            if (data.orderId === id) {
                console.log('📍 Location update received:', data);
                setTrackingData(prev => ({
                    ...prev,
                    deliveryPersonLocation: data.location,
                }));
            }
        });

        return () => {
            socket.emit('leave_tracking', id);
            socket.off('location_update');
        };
    }, [id]);

    const fetchTrackingData = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            };
            const res = await axios.get(`${API_URL}/api/tracking/${id}/tracking`, config);
            setTrackingData(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load tracking data');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="tracking-loading">Loading tracking information...</div>
            </>
        );
    }

    if (!trackingData) {
        return (
            <>
                <Navbar />
                <div className="tracking-loading">Order not found</div>
            </>
        );
    }

    const statusSteps = [
        { key: 'Pending', label: 'Order Placed', icon: FaCheckCircle },
        { key: 'Prepared', label: 'Food Prepared', icon: FaStore },
        { key: 'Driver Assigned', label: 'Driver Assigned', icon: FaMotorcycle },
        { key: 'Out for Delivery', label: 'Out for Delivery', icon: FaMotorcycle },
        { key: 'Delivered', label: 'Delivered', icon: FaCheckCircle },
    ];

    const currentStepIndex = statusSteps.findIndex(step => step.key === trackingData.status);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="tracking-container">
                <h1 className="tracking-title">Track Your Order</h1>
                <p className="tracking-order-id">Order #{id.slice(-8)}</p>

                <div className="tracking-content">
                    {/* Map Section */}
                    <div className="glass map-section">
                        <h2 className="section-title">
                            <FaMapMarkerAlt style={{ marginRight: '10px' }} />
                            Live Location
                        </h2>

                        <LiveTrackingMap trackingData={trackingData} />

                        {trackingData.deliveryPersonLocation && (
                            <div className="location-info">
                                <FaClock style={{ marginRight: '8px' }} />
                                Last updated: {new Date(trackingData.deliveryPersonLocation.lastUpdated).toLocaleTimeString()}
                            </div>
                        )}
                    </div>

                    {/* Status Timeline */}
                    <div className="glass status-section">
                        <h2 className="section-title">Order Status</h2>

                        <div className="timeline">
                            {statusSteps.map((step, index) => {
                                const Icon = step.icon;
                                const isCompleted = index <= currentStepIndex;
                                const isCurrent = index === currentStepIndex;

                                return (
                                    <div key={step.key} className="timeline-item">
                                        <div
                                            className="timeline-icon"
                                            style={{
                                                background: isCompleted ? '#ffa502' : '#444',
                                                transform: isCurrent ? 'scale(1.2)' : 'scale(1)',
                                            }}
                                        >
                                            <Icon size={20} color="#fff" />
                                        </div>
                                        <div className="timeline-content">
                                            <h4
                                                className="timeline-label"
                                                style={{ color: isCompleted ? '#fff' : '#777' }}
                                            >
                                                {step.label}
                                            </h4>
                                            {isCurrent && (
                                                <span className="current-badge">Current</span>
                                            )}
                                        </div>
                                        {index < statusSteps.length - 1 && (
                                            <div
                                                className="timeline-line"
                                                style={{ background: isCompleted ? '#ffa502' : '#444' }}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Details */}
                        <div className="order-details-section">
                            <h3 className="detailsTitle">Order Details</h3>
                            {trackingData.orderItems.map((item, index) => (
                                <div key={index} className="order-detail-item">
                                    <span>{item.qty}x {item.name}</span>
                                    <span>${item.price}</span>
                                </div>
                            ))}
                            <div className="total-row">
                                <span className="total-label">Total</span>
                                <span className="total-price">${trackingData.totalPrice}</span>
                            </div>
                        </div>

                        {/* Delivery Person Info */}
                        {trackingData.deliveryPerson && (
                            <div className="delivery-info-section">
                                <h3 className="details-title">Delivery Person</h3>
                                <div className="delivery-person-card">
                                    <div className="delivery-person-avatar">
                                        <FaMotorcycle size={24} color="#ffa502" />
                                    </div>
                                    <div className="delivery-person-details">
                                        <h4 className="delivery-person-name">{trackingData.deliveryPerson.name}</h4>
                                        <p className="delivery-person-phone">
                                            <FaPhone size={12} style={{ marginRight: '5px' }} />
                                            {trackingData.deliveryPerson.phone || 'Not available'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;
