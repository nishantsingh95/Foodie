import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CategoryBar from '../components/CategoryBar';
import FoodCard from '../components/FoodCard';
import ShopCard from '../components/ShopCard';
import Footer from '../components/Footer';
import AuthContext from '../context/AuthContext';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import API_URL from '../config/api';
import './Home.css';
import '../components/AdminFab.css';

const Home = () => {
    const [shops, setShops] = useState([]);
    const [foods, setFoods] = useState([]);
    const [filteredFoods, setFilteredFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('shops'); // 'shops' or 'menu'
    const [selectedShop, setSelectedShop] = useState(null);

    // Search & Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { user, login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const tokenProcessed = React.useRef(false);

    // Handle Google Login Token
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token && !tokenProcessed.current) {
            tokenProcessed.current = true;

            axios.get(`${API_URL}/api/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    login({ ...res.data, token });
                    toast.success('Login successful via Google!');
                    navigate('/');
                })
                .catch(err => {
                    console.error(err);
                    toast.error('Google Login failed');
                    tokenProcessed.current = false;
                });
        }
    }, [location, login, navigate]);

    useEffect(() => {
        if (view === 'shops') {
            fetchShops();
        }
    }, [view, user]);

    useEffect(() => {
        filterFoods();
    }, [searchTerm, selectedCategory, foods]);

    const fetchShops = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/api/shop/all`);
            setShops(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const fetchFoodsByShop = async (shop) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/api/food/shop/${shop.user}`);
            const normalized = res.data.map(f => ({
                ...f,
                isVeg: f.isVeg !== undefined ? f.isVeg : true,
                rating: f.rating || 4.5,
                restaurant: f.restaurant || shop.name
            }));
            setFoods(normalized);
            setFilteredFoods(normalized);
            setSelectedShop(shop);
            setView('menu');
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const filterFoods = () => {
        let result = foods;
        if (selectedCategory !== 'All') {
            result = result.filter(food => food.category === selectedCategory);
        }
        if (searchTerm) {
            result = result.filter(food =>
                food.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredFoods(result);
    }

    const backToShops = () => {
        setView('shops');
        setSelectedShop(null);
        setFoods([]);
        setFilteredFoods([]);
        setSelectedCategory('All');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)' }}>
            <Navbar setSearchTerm={setSearchTerm} />

            <div className="home-container">
                <CategoryBar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h2 className="home-section-title" style={{ margin: 0 }}>
                        {view === 'shops' ? 'All Restaurants' : `${selectedShop?.name}'s Menu`}
                    </h2>
                    {view === 'menu' && (
                        <button id="back-to-shops-btn" onClick={backToShops} className="nav-link-item" style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
                            Back to Restaurants
                        </button>
                    )}
                </div>

                {loading ? (
                    <p style={{ color: 'var(--text)', textAlign: 'center', opacity: 0.6 }}>Loading...</p>
                ) : (
                    <>
                        {view === 'shops' ? (
                            <div className="home-food-grid">
                                {shops.length > 0 ? shops.map((shop) => (
                                    <ShopCard key={shop._id} shop={shop} onClick={() => fetchFoodsByShop(shop)} />
                                )) : (
                                    <p style={{ gridColumn: 'span 5', textAlign: 'center', color: 'var(--text)', opacity: 0.6 }}>No restaurants found.</p>
                                )}
                            </div>
                        ) : (
                            <div className="home-food-grid">
                                {filteredFoods.length > 0 ? filteredFoods.map((food) => (
                                    <FoodCard key={food._id} food={food} />
                                )) : (
                                    <p style={{ gridColumn: 'span 5', textAlign: 'center', color: 'var(--text)', opacity: 0.6 }}>No food items found in this category.</p>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            <AdminFab />
            <Footer />
        </div>
    );
};

const AdminFab = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!user || user.role !== 'admin') return null;

    return (
        <button
            onClick={() => navigate('/admin')}
            className="admin-fab"
            title="Add New Item"
        >
            <FaPlus />
        </button>
    );
};

export default Home;
