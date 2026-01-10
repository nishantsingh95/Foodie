import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaStar, FaPlus, FaMinus, FaList } from 'react-icons/fa';
import AccessDenied from '../components/AccessDenied';
import API_URL from '../config/api';
import './Admin.css';

const AdminDashboard = () => {
    const { user, loading } = useContext(AuthContext);
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
        name: '', description: '', price: '', category: '', image: '', isVeg: true, rating: 4.5, available: true
    });
    const [editFoodId, setEditFoodId] = useState(null);
    const [showAddFood, setShowAddFood] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [uploading, setUploading] = useState(false);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await axios.post(`${API_URL}/api/upload`, formData, config);

            setFoodForm({ ...foodForm, image: data.image });
            setUploading(false);
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error(error);
            setUploading(false);
            toast.error('Image upload failed');
        }
    };

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
            const food = location.state.editFood;
            setEditFoodId(food._id);
            setFoodForm({
                name: food.name, description: food.description, price: food.price,
                category: food.category,
                image: food.image, isVeg: food.isVeg, rating: food.rating,
                available: food.available !== undefined ? food.available : true
            });
            setShowAddFood(true);
            window.scrollTo({ top: 400, behavior: 'smooth' });
            window.history.replaceState({}, document.title);
        }
    }, [location]);

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
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            const res = await axios.get(`${API_URL}/api/food/myfoods`, config);
            setFoods(res.data);
            const existingCategories = res.data.map(f => f.category);
            setCategories(prev => [...new Set([...prev, ...existingCategories])]);
        } catch (err) {
            console.error(err);
            // Fallback to empty if shop not found (e.g. new user)
            setFoods([]);
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

        // Let the backend handle ownership and restaurant metadata securely
        const payload = { ...foodForm };

        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

            if (editFoodId) {
                await axios.put(`${API_URL}/api/food/${editFoodId}`, payload, config);
                toast.success('Food updated');
                setEditFoodId(null);
            } else {
                await axios.post(`${API_URL}/api/food`, payload, config);
                toast.success('Food added');
            }

            setFoodForm({
                name: '', description: '', price: '', category: '', image: '', isVeg: true, rating: 4.5, available: true
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
            image: food.image, isVeg: food.isVeg, rating: food.rating,
            available: food.available !== undefined ? food.available : true
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

    const handleToggleAvailability = async (food) => {
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            const newStatus = food.available === false ? true : false;
            await axios.put(`${API_URL}/api/food/${food._id}`, { available: newStatus }, config);
            toast.success(`${food.name} is now ${newStatus ? 'Available' : 'Unavailable'}`);
            fetchFoods();
        } catch (err) {
            toast.error('Error updating status');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!user || user.role !== 'admin') return <AccessDenied />;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
            <Navbar setSearchTerm={setSearchTerm} />
            <div className="admin-dashboard">
                <div className="admin-header">
                    <h1 className="admin-title">Owner Dashboard</h1>
                    <div className="admin-header-actions">
                        {shop && (
                            <button onClick={() => navigate('/admin/orders')} className="admin-action-btn green">
                                <FaList /> Pending Orders
                            </button>
                        )}
                        {shop && !isEditingShop && (
                            <button onClick={() => setIsEditingShop(true)} className="admin-action-btn">
                                Edit Shop Info
                            </button>
                        )}
                    </div>
                </div>

                {/* Floating Action Button for Add Food */}
                {shop && (
                    <button
                        onClick={() => { setShowAddFood(!showAddFood); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                        className="admin-fab"
                        title={showAddFood ? "Close Form" : "Add Food Item"}
                    >
                        {showAddFood ? <FaMinus /> : <FaPlus />}
                    </button>
                )}



                {/* --- Shop Registration Section --- */}
                {(!shop || isEditingShop) && !searchTerm && (
                    <div className="glass admin-form-container">
                        <h2 className="admin-form-title">{shop ? 'Edit Shop Information' : 'Register Your Shop'}</h2>
                        <form onSubmit={handleShopSubmit} className="admin-form">
                            <input type="text" name="name" placeholder="Shop Name" value={shopForm.name} onChange={handleShopChange} required className="admin-input" />
                            <input type="text" name="image" placeholder="Shop Image URL" value={shopForm.image} onChange={handleShopChange} required className="admin-input" />
                            <input type="text" name="city" placeholder="City" value={shopForm.city} onChange={handleShopChange} required className="admin-input" />
                            <input type="text" name="state" placeholder="State" value={shopForm.state} onChange={handleShopChange} required className="admin-input" />
                            <textarea name="address" placeholder="Full Address" value={shopForm.address} onChange={handleShopChange} required className="admin-input full-width" rows="2" />
                            <div className="admin-form-actions">
                                <button type="submit" className="save-btn">Save Shop Details</button>
                                {isEditingShop && <button type="button" onClick={() => setIsEditingShop(false)} className="cancel-btn">Cancel</button>}
                            </div>
                        </form>
                    </div>
                )}

                {/* Display Shop Info if saved */}
                {shop && !isEditingShop && !searchTerm && (
                    <div className="glass shop-info-card">
                        <img src={shop.image} alt={shop.name} className="shop-image" />
                        <div className="shop-details">
                            <h2>{shop.name}</h2>
                            <p>{shop.address}, {shop.city}, {shop.state}</p>
                            <p style={{ color: 'var(--text)', opacity: 0.7, fontSize: '0.9rem' }}>This information will be displayed to users.</p>
                        </div>
                    </div>
                )}

                {/* --- Add Food Section --- */}
                {shop && !searchTerm && (
                    <div className={`glass admin-form-container ${showAddFood ? '' : 'hidden'}`} style={{ display: showAddFood ? 'block' : 'none' }}>
                        <h2 className="admin-form-title" style={{ color: 'var(--accent)' }}>{editFoodId ? 'Edit Food Item' : 'Add New Food Item'}</h2>
                        <form onSubmit={handleFoodSubmit} className="admin-form">
                            <input type="text" name="name" placeholder="Food Name" value={foodForm.name} onChange={handleFoodChange} required className="admin-input" />

                            <input
                                type="text"
                                name="category"
                                list="category-options"
                                placeholder="Category (Type or Select)"
                                value={foodForm.category}
                                onChange={handleFoodChange}
                                required
                                className="admin-input"
                            />
                            <datalist id="category-options">
                                {categories.map(cat => <option key={cat} value={cat} />)}
                            </datalist>

                            <input type="number" name="price" placeholder="Price" value={foodForm.price} onChange={handleFoodChange} required className="admin-input" />
                            <div className="admin-input-group" style={{ marginBottom: '1rem' }}>
                                <label style={{ color: 'var(--text)', opacity: 0.8, display: 'block', marginBottom: '5px' }}>Food Image</label>
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                    <input
                                        type="text"
                                        name="image"
                                        placeholder="Enter Image URL"
                                        value={foodForm.image}
                                        onChange={handleFoodChange}
                                        className="admin-input"
                                        style={{ flex: 1 }}
                                    />
                                    <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
                                        <button type="button" className="admin-action-btn" style={{ padding: '12px', background: 'var(--secondary)' }}>
                                            Upload
                                        </button>
                                        <input
                                            type="file"
                                            onChange={uploadFileHandler}
                                            style={{
                                                fontSize: '100px',
                                                position: 'absolute',
                                                left: 0,
                                                top: 0,
                                                opacity: 0,
                                                cursor: 'pointer'
                                            }}
                                        />
                                    </div>
                                </div>
                                {uploading && <p style={{ color: '#ffa502', fontSize: '0.9rem' }}>Uploading image...</p>}
                            </div>

                            <div className="admin-input" style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text)', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
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

                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    cursor: 'pointer',
                                    background: foodForm.available ? 'rgba(144, 238, 144, 0.05)' : 'rgba(255, 71, 87, 0.05)',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: `1px solid ${foodForm.available ? 'rgba(144, 238, 144, 0.2)' : 'rgba(255, 71, 87, 0.2)'}`,
                                    transition: 'all 0.3s',
                                    flex: '1 1 auto',
                                    justifyContent: 'center',
                                    minWidth: '200px'
                                }}>
                                    <input
                                        type="checkbox"
                                        name="available"
                                        checked={foodForm.available}
                                        onChange={(e) => setFoodForm({ ...foodForm, available: e.target.checked })}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                    <span style={{ color: foodForm.available ? 'lightgreen' : '#ff4757', fontWeight: '800', fontSize: '0.85rem' }}>
                                        {foodForm.available ? 'In Stock (Available)' : 'Out of Stock (Unavailable)'}
                                    </span>
                                </label>
                            </div>

                            {/* Star Rating Input */}
                            <div className="admin-input" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ color: 'var(--text)', opacity: 0.8 }}>Rating:</span>
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
                                    style={{ width: '60px', padding: '5px', marginLeft: '10px', background: 'var(--card-bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px' }}
                                    min="1"
                                    max="5"
                                    step="0.1"
                                />
                            </div>

                            <textarea name="description" placeholder="Description" value={foodForm.description} onChange={handleFoodChange} required className="admin-input full-width" rows="3" />

                            <div className="admin-form-actions">
                                <button type="submit" className="save-btn" style={{ backgroundColor: '#ff4757' }}>{editFoodId ? 'Update Item' : 'Add Item'}</button>
                                {editFoodId && <button type="button" onClick={() => { setEditFoodId(null); setFoodForm({ name: '', description: '', price: '', category: '', image: '', isVeg: true, rating: 4.5 }) }} className="cancel-btn">Cancel</button>}
                            </div>
                        </form>
                    </div>
                )}

                {shop && (
                    <>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, color: 'var(--text)' }}>{searchTerm ? `Search Results for "${searchTerm}"` : 'Manage Food Items'}</h2>
                        </div>
                        <div className="food-grid">
                            {foods.filter(food =>
                                (food.name && food.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                (food.category && food.category.toLowerCase().includes(searchTerm.toLowerCase()))
                            ).length > 0 ? (
                                foods.filter(food =>
                                    (food.name && food.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                    (food.category && food.category.toLowerCase().includes(searchTerm.toLowerCase()))
                                ).map((food) => (
                                    <div key={food._id} className="glass food-card">
                                        <img src={food.image} alt={food.name} className="food-card-img" />
                                        <div className="food-card-header">
                                            <h3 className="food-name">{food.name}</h3>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                {food.isVeg ? <span style={{ color: 'green' }}>● Veg</span> : <span style={{ color: 'red' }}>● Non-Veg</span>}
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    padding: '2px 8px',
                                                    borderRadius: '10px',
                                                    backgroundColor: food.available ? 'rgba(144, 238, 144, 0.2)' : 'rgba(255, 71, 87, 0.2)',
                                                    color: food.available ? 'lightgreen' : '#ff4757',
                                                    border: `1px solid ${food.available ? 'lightgreen' : '#ff4757'}`
                                                }}>
                                                    {food.available ? 'Available' : 'Unavailable'}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="food-desc">{food.description}</p>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text)', opacity: 0.7, marginBottom: '1rem' }}>
                                            <span>🏠 {food.restaurant || 'Shop'}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffd700' }}>
                                                {food.rating} <FaStar size={12} />
                                            </span>
                                        </div>

                                        <div className="food-footer">
                                            <span className="food-price">₹{food.price}</span>
                                            <div className="food-actions">
                                                <button
                                                    onClick={() => handleToggleAvailability(food)}
                                                    className={`edit-btn ${food.available === false ? 'unavailable-btn' : 'available-btn'}`}
                                                    style={{ backgroundColor: food.available === false ? '#ff4757' : '#2ed573' }}
                                                >
                                                    {food.available === false ? 'Set Available' : 'Set Unavailable'}
                                                </button>
                                                <button onClick={() => handleEditFood(food)} className="edit-btn">Edit</button>
                                                <button onClick={() => handleDeleteFood(food._id)} className="delete-btn">Delete</button>
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

export default AdminDashboard;
