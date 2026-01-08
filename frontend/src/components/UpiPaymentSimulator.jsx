import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaSpinner, FaTimes } from 'react-icons/fa';

const UpiPaymentSimulator = ({ isOpen, onClose, onSuccess, amount, upiId }) => {
    const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, failed
    const [countdown, setCountdown] = useState(30);

    useEffect(() => {
        if (isOpen && paymentStatus === 'pending') {
            // Simulate payment request sent
            setTimeout(() => {
                setPaymentStatus('processing');
            }, 1000);
        }
    }, [isOpen, paymentStatus]);

    useEffect(() => {
        if (paymentStatus === 'processing' && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [paymentStatus, countdown]);

    const handleApprove = () => {
        setPaymentStatus('success');
        setTimeout(() => {
            onSuccess();
        }, 2000);
    };

    const handleDecline = () => {
        setPaymentStatus('failed');
        setTimeout(() => {
            onClose();
            setPaymentStatus('pending');
            setCountdown(30);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div style={styles.overlay}>
            <div className="glass" style={styles.modal}>
                {paymentStatus === 'pending' && (
                    <div style={styles.content}>
                        <FaSpinner style={styles.spinnerIcon} className="fa-spin" />
                        <h2 style={styles.title}>Initiating Payment...</h2>
                        <p style={styles.subtitle}>Please wait</p>
                    </div>
                )}

                {paymentStatus === 'processing' && (
                    <div style={styles.content}>
                        <div style={styles.phoneSimulator}>
                            <div style={styles.phoneHeader}>
                                <span style={styles.phoneTime}>9:41</span>
                                <span style={styles.phoneTitle}>UPI Payment</span>
                                <span style={styles.phoneClose}>×</span>
                            </div>

                            <div style={styles.phoneBody}>
                                <div style={styles.upiLogo}>
                                    <div style={styles.upiIcon}>₹</div>
                                </div>

                                <h3 style={styles.merchantName}>Foodie</h3>
                                <p style={styles.merchantDesc}>Food Delivery Service</p>

                                <div style={styles.amountSection}>
                                    <span style={styles.amountLabel}>Amount to Pay</span>
                                    <span style={styles.amountValue}>₹{amount}</span>
                                </div>

                                <div style={styles.upiIdSection}>
                                    <span style={styles.upiLabel}>Paying to</span>
                                    <span style={styles.upiValue}>foodie@upi</span>
                                </div>

                                <div style={styles.upiIdSection}>
                                    <span style={styles.upiLabel}>From</span>
                                    <span style={styles.upiValue}>{upiId}</span>
                                </div>

                                <div style={styles.timerSection}>
                                    <FaSpinner className="fa-spin" style={{ marginRight: '8px' }} />
                                    Waiting for approval ({countdown}s)
                                </div>

                                <div style={styles.buttonGroup}>
                                    <button onClick={handleApprove} style={styles.approveBtn}>
                                        ✓ Approve Payment
                                    </button>
                                    <button onClick={handleDecline} style={styles.declineBtn}>
                                        × Decline
                                    </button>
                                </div>

                                <p style={styles.secureText}>🔒 Secure UPI Payment</p>
                            </div>
                        </div>
                    </div>
                )}

                {paymentStatus === 'success' && (
                    <div style={styles.content}>
                        <FaCheckCircle style={styles.successIcon} />
                        <h2 style={styles.title}>Payment Successful!</h2>
                        <p style={styles.subtitle}>₹{amount} paid via UPI</p>
                        <p style={styles.transactionId}>Transaction ID: TXN{Date.now().toString().slice(-10)}</p>
                    </div>
                )}

                {paymentStatus === 'failed' && (
                    <div style={styles.content}>
                        <FaTimes style={styles.failedIcon} />
                        <h2 style={styles.title}>Payment Failed</h2>
                        <p style={styles.subtitle}>Transaction was declined</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        backdropFilter: 'blur(10px)',
    },
    modal: {
        width: '90%',
        maxWidth: '450px',
        padding: '2rem',
    },
    content: {
        textAlign: 'center',
    },
    spinnerIcon: {
        fontSize: '4rem',
        color: '#ffa502',
        marginBottom: '1rem',
    },
    successIcon: {
        fontSize: '5rem',
        color: '#2ed573',
        marginBottom: '1rem',
        animation: 'scaleIn 0.5s ease',
    },
    failedIcon: {
        fontSize: '5rem',
        color: '#ff4757',
        marginBottom: '1rem',
    },
    title: {
        margin: '0 0 0.5rem 0',
        fontSize: '1.8rem',
        color: '#fff',
    },
    subtitle: {
        margin: 0,
        fontSize: '1rem',
        color: '#aaa',
    },
    transactionId: {
        marginTop: '1rem',
        fontSize: '0.85rem',
        color: '#777',
        fontFamily: 'monospace',
    },
    phoneSimulator: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        padding: '1rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
    },
    phoneHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 0',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        marginBottom: '1.5rem',
        color: '#fff',
        fontSize: '0.9rem',
    },
    phoneTime: {
        fontWeight: 'bold',
    },
    phoneTitle: {
        fontWeight: 'bold',
    },
    phoneClose: {
        fontSize: '1.5rem',
        cursor: 'pointer',
    },
    phoneBody: {
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '15px',
        padding: '1.5rem',
        color: '#333',
    },
    upiLogo: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '1rem',
    },
    upiIcon: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        fontWeight: 'bold',
    },
    merchantName: {
        margin: '0 0 0.25rem 0',
        fontSize: '1.3rem',
        color: '#333',
    },
    merchantDesc: {
        margin: '0 0 1.5rem 0',
        fontSize: '0.85rem',
        color: '#666',
    },
    amountSection: {
        background: '#f8f9fa',
        padding: '1rem',
        borderRadius: '10px',
        marginBottom: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    amountLabel: {
        fontSize: '0.85rem',
        color: '#666',
    },
    amountValue: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#2ed573',
    },
    upiIdSection: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.75rem 0',
        borderBottom: '1px solid #eee',
    },
    upiLabel: {
        fontSize: '0.9rem',
        color: '#666',
    },
    upiValue: {
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#333',
    },
    timerSection: {
        margin: '1.5rem 0',
        padding: '0.75rem',
        background: '#fff3cd',
        borderRadius: '8px',
        color: '#856404',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        marginBottom: '1rem',
    },
    approveBtn: {
        padding: '12px',
        background: '#2ed573',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    declineBtn: {
        padding: '12px',
        background: '#ff4757',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    secureText: {
        margin: 0,
        fontSize: '0.8rem',
        color: '#666',
    },
};

export default UpiPaymentSimulator;
