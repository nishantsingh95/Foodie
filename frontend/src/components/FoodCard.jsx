import React, { useState, useContext } from 'react';
import { FaStar, FaPlus, FaMinus, FaStore } from 'react-icons/fa';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';

const FoodCard = ({ food }) => {
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const [qty, setQty] = useState(1);
    const navigate = useNavigate();

    const handleAddToCart = () => {
        addToCart(food, qty);
        toast.success(`${qty} ${food.name} added to cart`);
        setQty(1);
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

    return (
        <div className="glass" style={styles.card}>
            <div style={styles.imageContainer}>
                <img src={food.image} alt={food.name} style={styles.image} />
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

            <div style={styles.content}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={styles.title}>{food.name}</h3>
                    <span style={styles.price}>${food.price}</span>
                </div>

                <p style={styles.restaurant}>
                    <FaStore style={{ marginRight: '5px', fontSize: '0.9rem' }} />
                    {food.restaurant || 'Foodie Kitchen'}
                </p>

                <p style={styles.desc}>{food.description}</p>

                <div style={styles.footer}>
                    {user && user.role === 'admin' ? (
                        <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                            <button onClick={handleEditClick} style={{ ...styles.addBtn, flex: 1, backgroundColor: '#1e90ff' }}>
                                Edit
                            </button>
                            <button onClick={handleDeleteClick} style={{ ...styles.addBtn, flex: 1, backgroundColor: '#ff4757' }}>
                                Delete
                            </button>
                        </div>
                    ) : (
                        <>
                            <div style={styles.qtyControl}>
                                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={styles.qtyBtn}><FaMinus /></button>
                                <span style={{ margin: '0 10px', minWidth: '20px', textAlign: 'center' }}>{qty}</span>
                                <button onClick={() => setQty(q => q + 1)} style={styles.qtyBtn}><FaPlus /></button>
                            </div>
                            <button onClick={handleAddToCart} style={styles.addBtn}>
                                Add
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    card: {
        padding: '0',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        border: '1px solid rgba(255,255,255,0.05)',
    },
    imageContainer: {
        position: 'relative',
        height: '180px',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
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
    },
    content: {
        padding: '1rem',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        margin: '0 0 5px 0',
        fontSize: '1.1rem',
        fontWeight: '700',
    },
    price: {
        color: '#ff4757',
        fontWeight: 'bold',
        fontSize: '1rem',
    },
    desc: {
        color: '#aaa',
        fontSize: '0.85rem',
        marginBottom: '10px',
        flex: 1,
        display: '-webkit-box',
        WebkitLineClamp: '2',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    },
    restaurant: {
        color: '#ffa502',
        fontSize: '0.8rem',
        marginBottom: '0.5rem',
        display: 'flex',
        alignItems: 'center',
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
    },
    qtyControl: {
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '5px',
        padding: '2px',
    },
    qtyBtn: {
        background: 'none',
        border: 'none',
        color: '#fff',
        padding: '5px 8px',
        cursor: 'pointer',
        fontSize: '0.7rem',
        display: 'flex',
        alignItems: 'center',
    },
    addBtn: {
        padding: '6px 16px',
        backgroundColor: '#ff4757',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '0.9rem',
    }
};

export default FoodCard;
