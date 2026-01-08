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
                // Removed toast notification to prevent repetitive popups
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
                    Authorization: `Bearer ${localStorage.getItem('token')} `,
                },
            };
            const res = await axios.get(`${API_URL} /api/tracking / ${id}/tracking`, config);
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
                <div style={styles.loading}>Loading tracking information...</div>
            </>
        );
    }

    if (!trackingData) {
        return (
            <>
                <Navbar />
                <div style={styles.loading}>Order not found</div>
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
        <>
            <Navbar />
            <div style={styles.container}>
                <h1 style={styles.title}>Track Your Order</h1>
                <p style={styles.orderId}>Order #{id.slice(-8)}</p>

                <div style={styles.content}>
                    {/* Map Section */}
                    <div className="glass" style={styles.mapSection}>
                        <h2 style={styles.sectionTitle}>
                            <FaMapMarkerAlt style={{ marginRight: '10px' }} />
                            Live Location
                        </h2>


                        <LiveTrackingMap trackingData={trackingData} />

                        {trackingData.deliveryPersonLocation && (
                            <div style={styles.locationInfo}>
                                <FaClock style={{ marginRight: '8px' }} />
                                Last updated: {new Date(trackingData.deliveryPersonLocation.lastUpdated).toLocaleTimeString()}
                            </div>
                        )}
                    </div>

                    {/* Status Timeline */}
                    <div className="glass" style={styles.statusSection}>
                        <h2 style={styles.sectionTitle}>Order Status</h2>

                        <div style={styles.timeline}>
                            {statusSteps.map((step, index) => {
                                const Icon = step.icon;
                                const isCompleted = index <= currentStepIndex;
                                const isCurrent = index === currentStepIndex;

                                return (
                                    <div key={step.key} style={styles.timelineItem}>
                                        <div style={{
                                            ...styles.timelineIcon,
                                            background: isCompleted ? '#ffa502' : '#444',
                                            transform: isCurrent ? 'scale(1.2)' : 'scale(1)',
                                        }}>
                                            <Icon size={20} color="#fff" />
                                        </div>
                                        <div style={styles.timelineContent}>
                                            <h4 style={{
                                                ...styles.timelineLabel,
                                                color: isCompleted ? '#fff' : '#777',
                                            }}>
                                                {step.label}
                                            </h4>
                                            {isCurrent && (
                                                <span style={styles.currentBadge}>Current</span>
                                            )}
                                        </div>
                                        {index < statusSteps.length - 1 && (
                                            <div style={{
                                                ...styles.timelineLine,
                                                background: isCompleted ? '#ffa502' : '#444',
                                            }} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Details */}
                        <div style={styles.orderDetails}>
                            <h3 style={styles.detailsTitle}>Order Details</h3>
                            {trackingData.orderItems.map((item, index) => (
                                <div key={index} style={styles.orderItem}>
                                    <span>{item.qty}x {item.name}</span>
                                    <span>${item.price}</span>
                                </div>
                            ))}
                            <div style={styles.totalRow}>
                                <span style={styles.totalLabel}>Total</span>
                                <span style={styles.totalPrice}>${trackingData.totalPrice}</span>
                            </div>
                        </div>

                        {/* Delivery Person Info */}
                        {trackingData.deliveryPerson && (
                            <div style={styles.deliveryInfo}>
                                <h3 style={styles.detailsTitle}>Delivery Person</h3>
                                <div style={styles.deliveryPersonCard}>
                                    <div style={styles.deliveryPersonAvatar}>
                                        <FaMotorcycle size={24} color="#ffa502" />
                                    </div>
                                    <div style={styles.deliveryPersonDetails}>
                                        <h4 style={styles.deliveryPersonName}>{trackingData.deliveryPerson.name}</h4>
                                        <p style={styles.deliveryPersonPhone}>
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

            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                .pulse {
                    animation: pulse 2s infinite;
                }
            `}</style>
        </>
    );
};

const styles = {
    container: {
        padding: '2rem',
        maxWidth: '1400px',
        margin: '0 auto',
        minHeight: '80vh',
    },
    title: {
        fontSize: '2.5rem',
        marginBottom: '0.5rem',
        color: '#fff',
        textAlign: 'center',
    },
    orderId: {
        textAlign: 'center',
        color: '#aaa',
        marginBottom: '2rem',
        fontSize: '1rem',
    },
    content: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem',
    },
    mapSection: {
        padding: '2rem',
    },
    statusSection: {
        padding: '2rem',
    },
    sectionTitle: {
        margin: '0 0 1.5rem 0',
        fontSize: '1.5rem',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
    },
    mapPlaceholder: {
        width: '100%',
        height: '500px',
        background: 'linear-gradient(135deg, #1e272e 0%, #2d3436 100%)',
        borderRadius: '15px',
        position: 'relative',
        overflow: 'hidden',
        border: '2px solid rgba(255,255,255,0.1)',
    },
    mapContent: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    marker: {
        position: 'absolute',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
    },
    markerLabel: {
        position: 'absolute',
        top: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.8)',
        color: '#fff',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '0.75rem',
        whiteSpace: 'nowrap',
    },
    routeLine: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
    },
    locationInfo: {
        marginTop: '1rem',
        padding: '0.75rem',
        background: 'rgba(255, 165, 2, 0.1)',
        borderRadius: '8px',
        color: '#ffa502',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
    },
    timeline: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0rem',
    },
    timelineItem: {
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        padding: '1rem 0',
    },
    timelineIcon: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s',
        zIndex: 2,
    },
    timelineContent: {
        marginLeft: '1rem',
        flex: 1,
    },
    timelineLabel: {
        margin: 0,
        fontSize: '1rem',
        fontWeight: '500',
    },
    currentBadge: {
        display: 'inline-block',
        marginLeft: '10px',
        padding: '2px 8px',
        background: '#ffa502',
        color: '#fff',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: 'bold',
    },
    timelineLine: {
        position: 'absolute',
        left: '19px',
        top: '50px',
        width: '2px',
        height: 'calc(100% + 1rem)',
        zIndex: 1,
    },
    orderDetails: {
        marginTop: '2rem',
        paddingTop: '2rem',
        borderTop: '1px solid rgba(255,255,255,0.1)',
    },
    detailsTitle: {
        margin: '0 0 1rem 0',
        fontSize: '1.2rem',
        color: '#fff',
    },
    orderItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.5rem 0',
        color: '#aaa',
    },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '1rem 0',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        marginTop: '0.5rem',
    },
    totalLabel: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#fff',
    },
    totalPrice: {
        fontSize: '1.3rem',
        fontWeight: 'bold',
        color: '#ffa502',
    },
    deliveryInfo: {
        marginTop: '2rem',
        paddingTop: '2rem',
        borderTop: '1px solid rgba(255,255,255,0.1)',
    },
    deliveryPersonCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '10px',
    },
    deliveryPersonAvatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'rgba(255, 165, 2, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deliveryPersonDetails: {
        flex: 1,
    },
    deliveryPersonName: {
        margin: '0 0 0.25rem 0',
        fontSize: '1.1rem',
        color: '#fff',
    },
    deliveryPersonPhone: {
        margin: 0,
        fontSize: '0.9rem',
        color: '#aaa',
        display: 'flex',
        alignItems: 'center',
    },
    loading: {
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        color: '#aaa',
    },
};

export default TrackOrder;
