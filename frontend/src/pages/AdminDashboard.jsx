import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaStar, FaPlus, FaMinus, FaList } from 'react-icons/fa';
import AccessDenied from '../components/AccessDenied';
import API_URL from '../config/api';

const AdminDashboard = () => {
    const { user, loading, logout } = useContext(AuthContext);
    const [foods, setFoods] = useState([]);
    const location = useLocation();

    // Shop State
    const [shop, setShop] = useState(null);
    const [shopForm, setShopForm] = useState({
        name: '', image: '', city: '', state: '', address: ''
    });
    const [isEditingShop, setIsEditingShop] = useState(false);

    // Food State
    const [foodForm, setFoodForm] = useState({
        name: '', description: '', price: '', category: '', image: '', isVeg: true, rating: 4.5
    });
    const [editFoodId, setEditFoodId] = useState(null);
    const [showAddFood, setShowAddFood] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [categories, setCategories] = useState([
        "Biryani", "Pizza", "Burgers", "North Indian", "South Indian",
        "Chinese", "Snacks", "Desserts", "Drinks", "Fast Food",
        "Sandwiches", "Pasta", "Salads"
    ]);

    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchShop(); // Check if shop exists
            fetchFoods();
        }
    }, [user]);

    // Handle Auto-Edit from Home Page
    useEffect(() => {
        if (location.state && location.state.editFood) {
            // Need to clear state to avoid loop or stuck state, but mostly just trigger edit
            const food = location.state.editFood;
            // Short timeout to ensure shop/foods are loaded or just set it directly
            // Since handleEditFood is local, we can just call logic here
            setEditFoodId(food._id);
            setFoodForm({
                name: food.name, description: food.description, price: food.price,
                category: food.category,
                image: food.image, isVeg: food.isVeg, rating: food.rating
            });
            setShowAddFood(true);
            window.scrollTo({ top: 400, behavior: 'smooth' });

            // Clear history state
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    // ... (fetchShop & fetchFoods remain same) ...
    const fetchShop = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            const res = await axios.get(`${API_URL}/api/shop`, config);
            setShop(res.data);
            setShopForm(res.data);
        } catch (err) {
            setShop(null);
        }
    };

    const fetchFoods = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/food`);
            setFoods(res.data);

            // Extract unique categories from existing foods
            const existingCategories = res.data.map(f => f.category);
            setCategories(prev => [...new Set([...prev, ...existingCategories])]);
        } catch (err) {
            console.error(err);
        }
    };

    // --- Shop Handlers ---
    const handleShopChange = (e) => setShopForm({ ...shopForm, [e.target.name]: e.target.value });

    const handleShopSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            const res = await axios.post(`${API_URL}/api/shop`, shopForm, config);
            setShop(res.data);
            setIsEditingShop(false);
            toast.success('Shop saved information');
        } catch (err) {
            toast.error('Error saving shop info');
        }
    };

    // --- Food Handlers ---
    const handleFoodChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        if (e.target.name === 'isVeg') {
            setFoodForm({ ...foodForm, isVeg: value === 'true' });
        } else {
            setFoodForm({ ...foodForm, [e.target.name]: value });
        }
    };

    const handleFoodSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...foodForm,
            restaurant: shop ? shop.name : 'Unknown Shop'
        };

        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

            if (editFoodId) {
                // Update
                await axios.put(`${API_URL}/api/food/${editFoodId}`, payload, config);
                toast.success('Food updated');
                setEditFoodId(null);
            } else {
                // Create
                await axios.post(`${API_URL}/api/food`, payload, config);
                toast.success('Food added');
            }

            setFoodForm({
                name: '', description: '', price: '', category: '', image: '', isVeg: true, rating: 4.5
            });
            fetchFoods();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error saving food');
        }
    };

    const handleEditFood = (food) => {
        setEditFoodId(food._id);
        setFoodForm({
            name: food.name, description: food.description, price: food.price,
            category: food.category,
            image: food.image, isVeg: food.isVeg, rating: food.rating
        });

        setShowAddFood(true);
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    const handleDeleteFood = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
                await axios.delete(`${API_URL}/api/food/${id}`, config);
                toast.success('Food deleted');
                fetchFoods();
            } catch (err) {
                toast.error('Error deleting food');
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!user || user.role !== 'admin') return <AccessDenied />;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#1e272e', color: '#fff' }}>
            <Navbar setSearchTerm={setSearchTerm} />
            <div className="admin-dashboard" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1>Owner Dashboard</h1>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        {shop && (
                            <button onClick={() => navigate('/admin/orders')} style={{ ...styles.editBtn, backgroundColor: '#2ed573', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaList /> Pending Orders
                            </button>
                        )}
                        {shop && !isEditingShop && <button onClick={() => setIsEditingShop(true)} style={styles.editBtn}>Edit Shop Info</button>}
                    </div>
                </div>

                {/* Floating Action Button for Add Food */}
                {shop && (
                    <button
                        onClick={() => { setShowAddFood(!showAddFood); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                        style={styles.fab}
                        title={showAddFood ? "Close Form" : "Add Food Item"}
                    >
                        {showAddFood ? <FaMinus /> : <FaPlus />}
                    </button>
                )}

                {/* --- Shop Registration Section (Hide when searching) --- */}
                {(!shop || isEditingShop) && !searchTerm && (
                    <div className="glass" style={{ padding: '2rem', marginBottom: '3rem', border: '1px solid #ffa502' }}>
                        <h2 style={{ marginBottom: '1.5rem', color: '#ffa502' }}>{shop ? 'Edit Shop Information' : 'Register Your Shop'}</h2>
                        <form onSubmit={handleShopSubmit} style={styles.gridForm}>
                            <input type="text" name="name" placeholder="Shop Name" value={shopForm.name} onChange={handleShopChange} required style={styles.input} />
                            <input type="text" name="image" placeholder="Shop Image URL" value={shopForm.image} onChange={handleShopChange} required style={styles.input} />
                            <input type="text" name="city" placeholder="City" value={shopForm.city} onChange={handleShopChange} required style={styles.input} />
                            <input type="text" name="state" placeholder="State" value={shopForm.state} onChange={handleShopChange} required style={styles.input} />
                            <textarea name="address" placeholder="Full Address" value={shopForm.address} onChange={handleShopChange} required style={{ ...styles.input, gridColumn: 'span 2' }} rows="2" />
                            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
                                <button type="submit" style={styles.button}>Save Shop Details</button>
                                {isEditingShop && <button type="button" onClick={() => setIsEditingShop(false)} style={{ ...styles.button, backgroundColor: '#777' }}>Cancel</button>}
                            </div>
                        </form>
                    </div>
                )}

                {/* Display Shop Info if saved (Hide when searching) */}
                {shop && !isEditingShop && !searchTerm && (
                    <div className="glass" style={{ padding: '2rem', marginBottom: '3rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <img src={shop.image} alt={shop.name} style={{ width: '150px', height: '150px', borderRadius: '10px', objectFit: 'cover' }} />
                        <div>
                            <h2 style={{ color: '#ffa502' }}>{shop.name}</h2>
                            <p>{shop.address}, {shop.city}, {shop.state}</p>
                            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>This information will be displayed to users.</p>
                        </div>
                    </div>
                )}

                {/* --- Add Food Section (Hide when searching) --- */}
                {shop && !searchTerm && (
                    <div className="glass" style={{ padding: '2rem', marginBottom: '3rem' }}>
                        <h2 style={{ marginBottom: '1.5rem', color: '#ff4757' }}>{editFoodId ? 'Edit Food Item' : 'Add New Food Item'}</h2>
                        <form onSubmit={handleFoodSubmit} style={styles.gridForm}>
                            <input type="text" name="name" placeholder="Food Name" value={foodForm.name} onChange={handleFoodChange} required style={styles.input} />

                            <input
                                type="text"
                                name="category"
                                list="category-options"
                                placeholder="Category (Type or Select)"
                                value={foodForm.category}
                                onChange={handleFoodChange}
                                required
                                style={styles.input}
                            />
                            <datalist id="category-options">
                                {categories.map(cat => <option key={cat} value={cat} />)}
                            </datalist>

                            <input type="number" name="price" placeholder="Price" value={foodForm.price} onChange={handleFoodChange} required style={styles.input} />
                            <input type="text" name="image" placeholder="Image URL" value={foodForm.image} onChange={handleFoodChange} required style={styles.input} />

                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#ccc', gridColumn: 'span 1', backgroundColor: 'rgba(255,255,255,0.05)', padding: '0 10px', borderRadius: '5px' }}>
                                <label style={{ fontWeight: 'bold' }}>Type:</label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                    <input type="radio" name="isVeg" value="true" checked={foodForm.isVeg === true} onChange={handleFoodChange} />
                                    <span style={{ color: 'lightgreen' }}>Veg</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                    <input type="radio" name="isVeg" value="false" checked={foodForm.isVeg === false} onChange={handleFoodChange} />
                                    <span style={{ color: '#ff4757' }}>Non-Veg</span>
                                </label>
                            </div>

                            {/* Star Rating Input */}
                            <div style={{ ...styles.input, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ color: '#ccc' }}>Rating:</span>
                                <div style={{ display: 'flex', cursor: 'pointer' }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={star}
                                            size={24}
                                            color={star <= Math.round(foodForm.rating) ? "#ffd700" : "#555"}
                                            onClick={() => setFoodForm({ ...foodForm, rating: star })}
                                            style={{ marginRight: '5px', transition: 'color 0.2s' }}
                                        />
                                    ))}
                                </div>
                                <input
                                    type="number"
                                    name="rating"
                                    value={foodForm.rating}
                                    onChange={handleFoodChange}
                                    style={{ ...styles.input, width: '60px', padding: '5px', marginLeft: '10px' }}
                                    min="1"
                                    max="5"
                                    step="0.1"
                                />
                            </div>

                            <textarea name="description" placeholder="Description" value={foodForm.description} onChange={handleFoodChange} required style={{ ...styles.input, gridColumn: 'span 2' }} rows="3" />

                            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
                                <button type="submit" style={{ ...styles.button, backgroundColor: '#ff4757' }}>{editFoodId ? 'Update Item' : 'Add Item'}</button>
                                {editFoodId && <button type="button" onClick={() => { setEditFoodId(null); setFoodForm({ name: '', description: '', price: '', category: '', image: '', isVeg: true, rating: 4.5 }) }} style={{ ...styles.button, backgroundColor: '#777' }}>Cancel</button>}
                            </div>
                        </form>
                    </div>
                )}

                {shop && (
                    <>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0 }}>{searchTerm ? `Search Results for "${searchTerm}"` : 'Manage Food Items'}</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                            {foods.filter(food =>
                                (food.name && food.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                (food.category && food.category.toLowerCase().includes(searchTerm.toLowerCase()))
                            ).length > 0 ? (
                                foods.filter(food =>
                                    (food.name && food.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                    (food.category && food.category.toLowerCase().includes(searchTerm.toLowerCase()))
                                ).map((food) => (
                                    <div key={food._id} className="glass" style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                                        <img src={food.image} alt={food.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <h3 style={{ margin: '0 0 0.5rem 0' }}>{food.name}</h3>
                                            {food.isVeg ? <span style={{ color: 'green' }}>● Veg</span> : <span style={{ color: 'red' }}>● Non-Veg</span>}
                                        </div>
                                        <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.5rem', flex: 1 }}>{food.description}</p>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#ccc', marginBottom: '1rem' }}>
                                            <span>🏠 {food.restaurant || 'Shop'}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffd700' }}>
                                                {food.rating} <FaStar size={12} />
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ffa502' }}>${food.price}</span>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button onClick={() => handleEditFood(food)} style={{ padding: '5px 10px', backgroundColor: '#1e90ff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Edit</button>
                                                <button onClick={() => handleDeleteFood(food._id)} style={{ padding: '5px 10px', backgroundColor: '#ff4757', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ color: '#aaa', fontStyle: 'italic', gridColumn: 'span 3', textAlign: 'center' }}>
                                    No food items found matching "{searchTerm}".
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div >
    );
};

const styles = {
    gridForm: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
    },
    input: {
        padding: '10px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: 'rgba(255,255,255,0.1)',
        color: '#fff',
    },
    button: {
        padding: '12px 24px',
        backgroundColor: '#ffa502',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    editBtn: {
        padding: '8px 16px',
        backgroundColor: '#70a1ff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    fab: {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#ff4757',
        color: '#fff',
        border: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.5rem',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        zIndex: 1000,
        transition: 'transform 0.2s',
    }
};

export default AdminDashboard;
