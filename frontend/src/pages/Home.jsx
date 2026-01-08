import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CategoryBar from '../components/CategoryBar';
import FoodCard from '../components/FoodCard';
import Footer from '../components/Footer';
import AuthContext from '../context/AuthContext';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import API_URL from '../config/api';

const Home = () => {
    const [foods, setFoods] = useState([]);
    const [filteredFoods, setFilteredFoods] = useState([]);
    const [loading, setLoading] = useState(true);

    // Search & Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { user, login } = useContext(AuthContext); // Get login from context
    const navigate = useNavigate();
    const location = useLocation();
    const tokenProcessed = React.useRef(false);

    // Handle Google Login Token
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token && !tokenProcessed.current) {
            tokenProcessed.current = true; // Mark as processed immediately

            // Verify token and get user data
            axios.get(`${API_URL}/api/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    login({ ...res.data, token }); // Log user in
                    toast.success('Login successful via Google!');
                    navigate('/'); // Clean URL
                })
                .catch(err => {
                    console.error(err);
                    toast.error('Google Login failed');
                    tokenProcessed.current = false; // Reset if failed so user can try again
                });
        }
    }, [location, login, navigate]);

    useEffect(() => {
        fetchFoods();
    }, []);

    useEffect(() => {
        filterFoods();
    }, [searchTerm, selectedCategory, foods]);

    const fetchFoods = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/food`);
            const normalized = res.data.map(f => ({
                ...f,
                isVeg: f.isVeg !== undefined ? f.isVeg : true,
                rating: f.rating || 4.5,
                restaurant: f.restaurant || 'Foodie Kitchen'
            }));
            setFoods(normalized);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const filterFoods = () => {
        let result = foods;

        // Filter by Category
        if (selectedCategory !== 'All') {
            result = result.filter(food => food.category === selectedCategory);
        }

        // Filter by Search
        if (searchTerm) {
            result = result.filter(food =>
                food.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredFoods(result);
    }



    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar setSearchTerm={setSearchTerm} />

            <div className="home-page" style={{ padding: '2rem', flex: 1 }}>
                <CategoryBar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

                {/* Best Shops Section */}


                <h2 style={styles.sectionTitle}>
                    {selectedCategory === 'All' ? 'Suggested Items' : selectedCategory}
                </h2>

                {loading ? (
                    <p>Loading tasty food...</p>
                ) : (
                    <div style={styles.foodGrid}>
                        {filteredFoods.length > 0 ? filteredFoods.map((food) => (
                            <FoodCard key={food._id} food={food} />
                        )) : (
                            <p>No food items found.</p>
                        )}
                    </div>
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
            style={{
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
            }}
            title="Add New Item"
        >
            <FaPlus />
        </button>
    );
};

const styles = {
    sectionTitle: {
        marginBottom: '1.5rem',
        color: '#ffa502',
        borderLeft: '4px solid #ff4757',
        paddingLeft: '10px',
    },
    shopGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '2rem',
    },
    shopCard: {
        padding: 0,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        border: '1px solid rgba(255,255,255,0.1)',
    },
    shopImage: {
        width: '100%',
        height: '160px',
        objectFit: 'cover',
    },
    foodGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '2rem',
    }
};

export default Home;
