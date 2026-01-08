import React, { useState } from 'react';
import { FaTimes, FaMoneyBillWave, FaMobileAlt, FaCheckCircle } from 'react-icons/fa';

const PaymentModal = ({ isOpen, onClose, onConfirm, totalAmount }) => {
    const [selectedMethod, setSelectedMethod] = useState('cod');
    const [upiId, setUpiId] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (selectedMethod === 'upi' && !upiId.trim()) {
            alert('Please enter your UPI ID');
            return;
        }
        onConfirm(selectedMethod, upiId);
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div className="glass" style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Select Payment Method</h2>
                    <button onClick={onClose} style={styles.closeBtn}>
                        <FaTimes />
                    </button>
                </div>

                <div style={styles.content}>
                    <div style={styles.amountSection}>
                        <span style={styles.amountLabel}>Total Amount</span>
                        <span style={styles.amountValue}>${totalAmount}</span>
                    </div>

                    <div style={styles.methodsContainer}>
                        {/* Cash on Delivery */}
                        <div
                            style={{
                                ...styles.methodCard,
                                border: selectedMethod === 'cod' ? '2px solid #ffa502' : '1px solid rgba(255,255,255,0.1)',
                                background: selectedMethod === 'cod' ? 'rgba(255, 165, 2, 0.1)' : 'rgba(255,255,255,0.05)',
                            }}
                            onClick={() => setSelectedMethod('cod')}
                        >
                            <div style={styles.methodIcon}>
                                <FaMoneyBillWave size={30} color="#2ed573" />
                            </div>
                            <div style={styles.methodDetails}>
                                <h3 style={styles.methodName}>Cash on Delivery</h3>
                                <p style={styles.methodDesc}>Pay with cash when your order arrives</p>
                            </div>
                            {selectedMethod === 'cod' && (
                                <FaCheckCircle size={24} color="#ffa502" />
                            )}
                        </div>

                        {/* UPI Payment */}
                        <div
                            style={{
                                ...styles.methodCard,
                                border: selectedMethod === 'upi' ? '2px solid #ffa502' : '1px solid rgba(255,255,255,0.1)',
                                background: selectedMethod === 'upi' ? 'rgba(255, 165, 2, 0.1)' : 'rgba(255,255,255,0.05)',
                            }}
                            onClick={() => setSelectedMethod('upi')}
                        >
                            <div style={styles.methodIcon}>
                                <FaMobileAlt size={30} color="#5f27cd" />
                            </div>
                            <div style={styles.methodDetails}>
                                <h3 style={styles.methodName}>UPI Payment</h3>
                                <p style={styles.methodDesc}>Pay using Google Pay, PhonePe, Paytm, etc.</p>
                            </div>
                            {selectedMethod === 'upi' && (
                                <FaCheckCircle size={24} color="#ffa502" />
                            )}
                        </div>
                    </div>

                    {selectedMethod === 'upi' && (
                        <div style={styles.upiSection}>
                            <label style={styles.upiLabel}>Enter your UPI ID</label>
                            <input
                                type="text"
                                placeholder="yourname@upi"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                style={styles.upiInput}
                            />
                            <p style={styles.upiHint}>
                                You'll receive a payment request on your UPI app
                            </p>
                        </div>
                    )}

                    <button onClick={handleConfirm} style={styles.confirmBtn}>
                        Confirm & Place Order
                    </button>
                </div>
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(5px)',
    },
    modal: {
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
    },
    title: {
        margin: 0,
        fontSize: '1.5rem',
        color: '#fff',
    },
    closeBtn: {
        background: 'rgba(255,255,255,0.1)',
        border: 'none',
        color: '#fff',
        width: '35px',
        height: '35px',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
    },
    content: {
        padding: '1.5rem',
    },
    amountSection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        background: 'rgba(255, 165, 2, 0.1)',
        borderRadius: '10px',
        marginBottom: '1.5rem',
        border: '1px solid rgba(255, 165, 2, 0.3)',
    },
    amountLabel: {
        fontSize: '1rem',
        color: '#aaa',
    },
    amountValue: {
        fontSize: '1.8rem',
        fontWeight: 'bold',
        color: '#ffa502',
    },
    methodsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '1.5rem',
    },
    methodCard: {
        padding: '1.5rem',
        borderRadius: '12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        transition: 'all 0.3s',
    },
    methodIcon: {
        width: '60px',
        height: '60px',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    methodDetails: {
        flex: 1,
    },
    methodName: {
        margin: '0 0 0.5rem 0',
        fontSize: '1.1rem',
        color: '#fff',
    },
    methodDesc: {
        margin: 0,
        fontSize: '0.85rem',
        color: '#aaa',
    },
    upiSection: {
        padding: '1rem',
        background: 'rgba(95, 39, 205, 0.1)',
        borderRadius: '10px',
        marginBottom: '1.5rem',
        border: '1px solid rgba(95, 39, 205, 0.3)',
    },
    upiLabel: {
        display: 'block',
        marginBottom: '0.5rem',
        color: '#fff',
        fontSize: '0.9rem',
    },
    upiInput: {
        width: '100%',
        padding: '12px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '1rem',
        boxSizing: 'border-box',
    },
    upiHint: {
        margin: '0.5rem 0 0 0',
        fontSize: '0.8rem',
        color: '#aaa',
    },
    confirmBtn: {
        width: '100%',
        padding: '15px',
        background: 'linear-gradient(135deg, #ffa502 0%, #ff6348 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s',
        boxShadow: '0 4px 15px rgba(255, 165, 2, 0.3)',
    },
};

export default PaymentModal;
