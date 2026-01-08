import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import LocationContext from '../context/LocationContext';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

import UserProfileModal from './UserProfileModal';

const Navbar = ({ setSearchTerm }) => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const { location: userLocation, openLocationModal } = useContext(LocationContext);
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');
    const [showProfileModal, setShowProfileModal] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    const handleSearch = (e) => {
        setSearchInput(e.target.value);
        if (setSearchTerm) {
            setSearchTerm(e.target.value);
        }
    }

    const isDelivery = user && user.role === 'delivery';

    return (
        <>
            <nav style={styles.nav}>
                <div style={styles.logoContainer}>
                    <div style={styles.logo}>
                        <Link to={isDelivery ? "/delivery" : "/"} style={styles.link}>Foodie</Link>
                    </div>
                    <div style={styles.location} onClick={openLocationModal} title="Click to change location">
                        <FaMapMarkerAlt style={{ color: '#ff4757', marginRight: '5px' }} />
                        <span style={{ fontSize: '0.9rem', color: '#ccc' }}>{userLocation || 'Locating...'}</span>
                    </div>
                </div>

                {!isDelivery && (
                    <div style={styles.searchBar}>
                        <FaSearch style={{ color: '#aaa', marginLeft: '10px' }} />
                        <input
                            type="text"
                            placeholder="Search for food..."
                            style={styles.input}
                            value={searchInput}
                            onChange={handleSearch}
                        />
                    </div>
                )}

                <div style={styles.links}>
                    {!isDelivery && <Link to="/" style={styles.link}>Home</Link>}

                    {user && user.role === 'admin' && (
                        <>
                            <Link to="/admin" style={styles.link}>Owner</Link>
                            <Link to="/admin/orders" style={styles.link}>Pending Orders</Link>
                        </>
                    )}
                    {user && user.role === 'delivery' && <Link to="/delivery" style={styles.link}>Delivery Dashboard</Link>}
                    {user && user.role === 'user' && <Link to="/myorders" style={styles.link}>My Orders</Link>}

                    {(!user || (user.role !== 'admin' && user.role !== 'delivery')) && (
                        <Link to="/cart" style={{ ...styles.link, position: 'relative' }}>
                            <FaShoppingCart />
                            {cartItems.length > 0 && (
                                <span style={styles.badge}>{cartItems.reduce((acc, item) => acc + item.qty, 0)}</span>
                            )}
                        </Link>
                    )}

                    {user ? (
                        <div style={styles.userMenu}>
                            <span
                                onClick={() => setShowProfileModal(true)}
                                style={{ marginRight: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                                title="View Profile"
                            >
                                <FaUser /> {user.name}
                            </span>
                            <button onClick={handleLogout} style={styles.logoutBtn}><FaSignOutAlt /></button>
                        </div>
                    ) : (
                        <Link to="/login" style={styles.link}>Login</Link>
                    )}
                </div>
            </nav>
            {showProfileModal && (
                <UserProfileModal user={user} onClose={() => setShowProfileModal(false)} />
            )}
        </>
    );
};

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.8rem 2rem',
        backgroundColor: '#2f3542',
        color: '#fff',
        borderBottom: '1px solid #444',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    location: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
    },
    searchBar: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '5px 10px',
        width: '30%',
    },
    input: {
        background: 'none',
        border: 'none',
        color: '#fff',
        padding: '8px',
        width: '100%',
        outline: 'none',
    },
    links: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    link: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
    },
    badge: {
        position: 'absolute',
        top: '-8px',
        right: '-12px',
        backgroundColor: '#ff4757',
        color: 'white',
        borderRadius: '50%',
        padding: '2px 6px',
        fontSize: '0.8rem',
    },
    logoutBtn: {
        background: 'none',
        border: 'none',
        color: '#ff4757',
        cursor: 'pointer',
        fontSize: '1.1rem'
    },
    userMenu: {
        display: 'flex',
        alignItems: 'center',
    }
};

export default Navbar;
