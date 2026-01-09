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
import './Cart.css';

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
            setShowPaymentModal(false);
            setShowUpiSimulator(true);
        } else {
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
            <div className="page-container">
                <h1 className="cart-header">
                    <FaShoppingBag style={{ marginRight: '10px' }} />
                    Your Cart
                </h1>

                {cartItems.length === 0 ? (
                    <div className="glass empty-cart-container">
                        <FaShoppingBag size={60} style={{ color: '#555', marginBottom: '1rem' }} />
                        <h2 style={{ color: '#aaa', marginBottom: '0.5rem' }}>Your cart is empty</h2>
                        <p className="empty-cart-text">Add some delicious items to get started!</p>
                        <button onClick={() => navigate('/')} className="shop-now-btn">
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="cart-layout">
                        <div className="cart-items-section">
                            {cartItems.map((item) => (
                                <div key={item._id} className="glass cart-item-card">
                                    <img src={item.image} alt={item.name} className="cart-item-image" />

                                    <div className="cart-item-details">
                                        <h3 className="cart-item-name">{item.name}</h3>
                                        <p className="cart-item-price">${item.price}</p>
                                    </div>

                                    <div className="qty-control">
                                        <button
                                            onClick={() => updateQuantity(item._id, item.qty - 1)}
                                            className="qty-btn"
                                            disabled={item.qty <= 1}
                                        >
                                            <FaMinus />
                                        </button>
                                        <span className="qty-value">{item.qty}</span>
                                        <button
                                            onClick={() => updateQuantity(item._id, item.qty + 1)}
                                            className="qty-btn"
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>

                                    <div className="cart-item-total-section">
                                        <p className="cart-total-label">Total</p>
                                        <p className="cart-total-price">${(item.price * item.qty).toFixed(2)}</p>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="remove-btn"
                                        title="Remove item"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="glass cart-summary-section">
                            <h2 className="summary-title">Order Summary</h2>

                            <div className="summary-row">
                                <span className="summary-label">Subtotal ({cartItems.length} items)</span>
                                <span className="summary-value">${totalPrice}</span>
                            </div>

                            <div className="summary-row">
                                <span className="summary-label">Delivery Fee</span>
                                <span className="summary-value" style={{ color: '#2ed573' }}>FREE</span>
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-row">
                                <span className="cart-total-label" style={{ fontSize: '1.2rem' }}>Total</span>
                                <span className="grand-total">${totalPrice}</span>
                            </div>

                            <button onClick={handleCheckoutClick} className="checkout-btn">
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

export default Cart;
