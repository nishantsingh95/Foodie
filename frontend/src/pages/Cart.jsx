import React, { useContext, useState } from 'react';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PaymentModal from '../components/PaymentModal';
import UpiPaymentSimulator from '../components/UpiPaymentSimulator';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaMinus, FaTrash, FaShoppingBag } from 'react-icons/fa';
import API_URL from '../config/api';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showUpiSimulator, setShowUpiSimulator] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [selectedUpiId, setSelectedUpiId] = useState('');

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);

    const handleCheckoutClick = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setShowPaymentModal(true);
    };

    const handlePaymentConfirm = async (paymentMethod, upiId) => {
        setSelectedPaymentMethod(paymentMethod);
        setSelectedUpiId(upiId);

        if (paymentMethod === 'upi') {
            // Show UPI payment simulator
            setShowPaymentModal(false);
            setShowUpiSimulator(true);
        } else {
            // COD - place order directly
            await placeOrder(paymentMethod, upiId);
        }
    };

    const handleUpiPaymentSuccess = async () => {
        await placeOrder(selectedPaymentMethod, selectedUpiId);
    };

    const placeOrder = async (paymentMethod, upiId) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            };

            await axios.post(
                `${API_URL}/api/orders`,
                {
                    orderItems: cartItems.map(item => ({ ...item, food: item._id })),
                    totalPrice,
                    deliveryLocation: { address: user.address, lat: 0, lng: 0 },
                    paymentMethod,
                    upiId: paymentMethod === 'upi' ? upiId : undefined,
                },
                config
            );

            toast.success(`Order placed successfully! Payment method: ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI'}`);
            clearCart();
            setShowPaymentModal(false);
            setShowUpiSimulator(false);
            navigate('/myorders');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Order failed');
            setShowUpiSimulator(false);
        }
    };

    return (
        <>
            <Navbar />
            <div style={styles.container}>
                <h1 style={styles.title}>
                    <FaShoppingBag style={{ marginRight: '10px' }} />
                    Your Cart
                </h1>

                {cartItems.length === 0 ? (
                    <div className="glass" style={styles.emptyCart}>
                        <FaShoppingBag size={60} style={{ color: '#555', marginBottom: '1rem' }} />
                        <h2 style={{ color: '#aaa', marginBottom: '0.5rem' }}>Your cart is empty</h2>
                        <p style={{ color: '#777', marginBottom: '1.5rem' }}>Add some delicious items to get started!</p>
                        <button onClick={() => navigate('/')} style={styles.shopBtn}>
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div style={styles.cartContent}>
                        <div style={styles.itemsSection}>
                            {cartItems.map((item) => (
                                <div key={item._id} className="glass" style={styles.cartItem}>
                                    <img src={item.image} alt={item.name} style={styles.itemImage} />

                                    <div style={styles.itemDetails}>
                                        <h3 style={styles.itemName}>{item.name}</h3>
                                        <p style={styles.itemPrice}>${item.price}</p>
                                    </div>

                                    <div style={styles.quantityControl}>
                                        <button
                                            onClick={() => updateQuantity(item._id, item.qty - 1)}
                                            style={styles.qtyBtn}
                                            disabled={item.qty <= 1}
                                        >
                                            <FaMinus />
                                        </button>
                                        <span style={styles.qtyDisplay}>{item.qty}</span>
                                        <button
                                            onClick={() => updateQuantity(item._id, item.qty + 1)}
                                            style={styles.qtyBtn}
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>

                                    <div style={styles.itemTotal}>
                                        <p style={styles.totalLabel}>Total</p>
                                        <p style={styles.totalPrice}>${(item.price * item.qty).toFixed(2)}</p>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        style={styles.removeBtn}
                                        title="Remove item"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="glass" style={styles.summarySection}>
                            <h2 style={styles.summaryTitle}>Order Summary</h2>

                            <div style={styles.summaryRow}>
                                <span style={styles.summaryLabel}>Subtotal ({cartItems.length} items)</span>
                                <span style={styles.summaryValue}>${totalPrice}</span>
                            </div>

                            <div style={styles.summaryRow}>
                                <span style={styles.summaryLabel}>Delivery Fee</span>
                                <span style={{ ...styles.summaryValue, color: '#2ed573' }}>FREE</span>
                            </div>

                            <div style={styles.divider}></div>

                            <div style={styles.summaryRow}>
                                <span style={styles.totalLabel}>Total</span>
                                <span style={styles.grandTotal}>${totalPrice}</span>
                            </div>

                            <button onClick={handleCheckoutClick} style={styles.checkoutBtn}>
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}

                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    onConfirm={handlePaymentConfirm}
                    totalAmount={totalPrice}
                />

                <UpiPaymentSimulator
                    isOpen={showUpiSimulator}
                    onClose={() => setShowUpiSimulator(false)}
                    onSuccess={handleUpiPaymentSuccess}
                    amount={totalPrice}
                    upiId={selectedUpiId}
                />
            </div>
        </>
    );
};

const styles = {
    container: {
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: '80vh',
    },
    title: {
        marginBottom: '2rem',
        textAlign: 'center',
        fontSize: '2.5rem',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyCart: {
        padding: '4rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    shopBtn: {
        padding: '12px 30px',
        backgroundColor: '#ff4757',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s',
    },
    cartContent: {
        display: 'grid',
        gridTemplateColumns: '1fr 350px',
        gap: '2rem',
    },
    itemsSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    cartItem: {
        padding: '1.5rem',
        display: 'grid',
        gridTemplateColumns: '100px 1fr auto auto auto',
        gap: '1.5rem',
        alignItems: 'center',
        transition: 'transform 0.2s',
    },
    itemImage: {
        width: '100px',
        height: '100px',
        objectFit: 'cover',
        borderRadius: '10px',
        border: '2px solid rgba(255,255,255,0.1)',
    },
    itemDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    itemName: {
        margin: 0,
        fontSize: '1.2rem',
        fontWeight: '600',
        color: '#fff',
    },
    itemPrice: {
        margin: 0,
        fontSize: '1rem',
        color: '#aaa',
    },
    quantityControl: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '8px',
        padding: '0.5rem',
    },
    qtyBtn: {
        background: 'rgba(255,255,255,0.1)',
        border: 'none',
        color: '#fff',
        width: '32px',
        height: '32px',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
    },
    qtyDisplay: {
        minWidth: '30px',
        textAlign: 'center',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#fff',
    },
    itemTotal: {
        textAlign: 'right',
    },
    totalLabel: {
        margin: 0,
        fontSize: '0.85rem',
        color: '#aaa',
        marginBottom: '0.25rem',
    },
    totalPrice: {
        margin: 0,
        fontSize: '1.3rem',
        fontWeight: 'bold',
        color: '#ffa502',
    },
    removeBtn: {
        background: 'rgba(255, 71, 87, 0.1)',
        border: '1px solid rgba(255, 71, 87, 0.3)',
        color: '#ff4757',
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
    },
    summarySection: {
        padding: '2rem',
        height: 'fit-content',
        position: 'sticky',
        top: '2rem',
    },
    summaryTitle: {
        margin: '0 0 1.5rem 0',
        fontSize: '1.5rem',
        color: '#fff',
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1rem',
    },
    summaryLabel: {
        color: '#aaa',
        fontSize: '1rem',
    },
    summaryValue: {
        color: '#fff',
        fontSize: '1rem',
        fontWeight: '500',
    },
    divider: {
        height: '1px',
        background: 'rgba(255,255,255,0.1)',
        margin: '1.5rem 0',
    },
    grandTotal: {
        color: '#ffa502',
        fontSize: '1.8rem',
        fontWeight: 'bold',
    },
    checkoutBtn: {
        width: '100%',
        padding: '15px',
        backgroundColor: '#ffa502',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '1.5rem',
        transition: 'all 0.3s',
        boxShadow: '0 4px 15px rgba(255, 165, 2, 0.3)',
    },
};

export default Cart;
