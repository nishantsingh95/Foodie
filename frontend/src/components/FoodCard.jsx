import React, { useState, useContext } from 'react';
import { FaStar, FaPlus, FaMinus, FaStore } from 'react-icons/fa';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';
import './FoodCard.css';

const FoodCard = ({ food }) => {
    const { addToCart, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const [qty, setQty] = useState(1);
    const navigate = useNavigate();

    const handleAddToCart = () => {
        const result = addToCart(food, qty);

        if (result.success) {
            toast.success(`${qty} ${food.name} added to cart`);
            setQty(1);
        } else if (result.error === 'conflict') {
            if (window.confirm(`Start a new basket?\n\nYour basket contains items from "${result.currentRestaurant}". Do you want to clear it and add items from "${result.newRestaurant}"?`)) {

                // Force new cart
                addToCart(food, qty, true);

                toast.success(`${qty} ${food.name} added to new basket`);
                setQty(1);
            }
        }
    };

    const handleEditClick = () => {
        navigate('/admin', { state: { editFood: food } });
    };

    const handleDeleteClick = async () => {
        if (window.confirm(`Are you sure you want to delete ${food.name}?`)) {
            try {
                const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
                await axios.delete(`${API_URL}/api/food/${food._id}`, config);
                toast.success('Food deleted');
                // Reload to reflect changes since we don't have a callback ref from Home
                window.location.reload();
            } catch (err) {
                toast.error('Error deleting food');
            }
        }
    };

    const isAvailable = food.available !== false; // Default to true if undefined

    return (
        <div className={`glass food-card ${!isAvailable ? 'unavailable' : ''}`}>
            <div className="food-card-image-container">
                <img src={food.image} alt={food.name} className="food-card-image" />

                {!isAvailable && (
                    <div className="unavailable-overlay">
                        <span>OUT OF STOCK</span>
                    </div>
                )}

                <div style={styles.typeTag}>
                    {food.isVeg ? (
                        <div style={{ ...styles.dot, border: '1px solid green' }} title="Veg">
                            <div style={{ ...styles.innerDot, background: 'green' }}></div>
                        </div>
                    ) : (
                        <div style={{ ...styles.dot, border: '1px solid red' }} title="Non-Veg">
                            <div style={{ ...styles.innerDot, background: 'red' }}></div>
                        </div>
                    )}
                </div>
                <div style={styles.rating}>
                    <span style={{ fontWeight: 'bold', marginRight: '3px' }}>{food.rating}</span>
                    <FaStar style={{ fontSize: '0.8rem', color: '#ffd700' }} />
                </div>
            </div>

            <div className="food-card-content">
                <div className="food-card-header">
                    <h3 className="food-card-title">{food.name}</h3>
                    <span className="food-card-price">₹{food.price}</span>
                </div>

                <p className="food-card-restaurant">
                    <FaStore style={{ marginRight: '5px', fontSize: '0.9rem' }} />
                    {food.restaurant || 'Foodie Kitchen'}
                </p>

                <p className="food-card-desc">{food.description}</p>

                <div className="food-card-footer">
                    {user && user.role === 'admin' ? (
                        <div className="food-card-admin-actions">
                            <button onClick={handleEditClick} className="food-card-add-btn edit-btn">
                                Edit
                            </button>
                            <button onClick={handleDeleteClick} className="food-card-add-btn delete-btn">
                                Delete
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="food-card-qty-control" style={{ opacity: !isAvailable ? 0.5 : 1 }}>
                                <button
                                    onClick={() => setQty(q => Math.max(1, q - 1))}
                                    className="food-card-qty-btn"
                                    disabled={!isAvailable}
                                >
                                    <FaMinus />
                                </button>
                                <span style={{ margin: '0 10px', minWidth: '20px', textAlign: 'center' }}>{qty}</span>
                                <button
                                    onClick={() => setQty(q => q + 1)}
                                    className="food-card-qty-btn"
                                    disabled={!isAvailable}
                                >
                                    <FaPlus />
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className={`food-card-add-btn ${!isAvailable ? 'disabled' : ''}`}
                                disabled={!isAvailable}
                            >
                                {isAvailable ? 'Add' : 'Out of Stock'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    // card: replaced by .food-card
    // imageContainer: replaced by .food-card-image-container
    // image: replaced by .food-card-image
    typeTag: {
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: '#fff',
        padding: '4px',
        borderRadius: '4px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    },
    dot: {
        width: '14px',
        height: '14px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
    },
    rating: {
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        background: 'rgba(255, 255, 255, 0.9)',
        color: '#333',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '0.8rem',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    }
};

export default FoodCard;
