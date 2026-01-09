import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import LocationContext from '../context/LocationContext';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaSearch, FaMapMarkerAlt, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

import UserProfileModal from './UserProfileModal';

const Navbar = ({ setSearchTerm }) => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const { location: userLocation, openLocationModal } = useContext(LocationContext);
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
    }

    const handleSearch = (e) => {
        setSearchInput(e.target.value);
        if (setSearchTerm) {
            setSearchTerm(e.target.value);
        }
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    }

    const isDelivery = user && user.role === 'delivery';

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-logo-container">
                        <Link to={isDelivery ? "/delivery" : "/"} className="navbar-link" onClick={closeMobileMenu}>
                            <span className="navbar-logo-emoji">🍔</span>
                            <span className="navbar-logo-text">Foodie</span>
                        </Link>
                    </div>

                    <div className="navbar-mobile-toggle" onClick={toggleMobileMenu}>
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </div>

                    <div className={`navbar-collapse ${isMobileMenuOpen ? 'active' : ''}`}>
                        <div className="navbar-location" onClick={() => { openLocationModal(); closeMobileMenu(); }} title="Click to change location">
                            <FaMapMarkerAlt style={{ color: '#ff4757', marginRight: '5px' }} />
                            <span style={{ fontSize: '0.9rem', color: '#ccc' }}>{userLocation || 'Locating...'}</span>
                        </div>

                        {!isDelivery && (
                            <div className="navbar-search">
                                <FaSearch style={{ color: '#aaa', marginLeft: '10px' }} />
                                <input
                                    type="text"
                                    placeholder="Search for food..."
                                    className="navbar-search-input"
                                    value={searchInput}
                                    onChange={handleSearch}
                                />
                            </div>
                        )}

                        <div className="navbar-links">
                            {!isDelivery && <Link to="/" className="navbar-link" onClick={closeMobileMenu}>Home</Link>}

                            {user && user.role === 'admin' && (
                                <>
                                    <Link to="/admin" className="navbar-link" onClick={closeMobileMenu}>Owner</Link>
                                    <Link to="/admin/orders" className="navbar-link" onClick={closeMobileMenu}>Pending Orders</Link>
                                </>
                            )}
                            {user && user.role === 'delivery' && <Link to="/delivery" className="navbar-link" onClick={closeMobileMenu}>Delivery Dashboard</Link>}
                            {user && user.role === 'user' && <Link to="/myorders" className="navbar-link" onClick={closeMobileMenu}>My Orders</Link>}

                            {(!user || (user.role !== 'admin' && user.role !== 'delivery')) && (
                                <Link to="/cart" className="navbar-link" style={{ position: 'relative' }} onClick={closeMobileMenu}>
                                    <FaShoppingCart />
                                    {cartItems.length > 0 && (
                                        <span className="navbar-cart-badge">{cartItems.reduce((acc, item) => acc + item.qty, 0)}</span>
                                    )}
                                </Link>
                            )}

                            {user ? (
                                <div className="navbar-user-menu">
                                    <span
                                        onClick={() => { setShowProfileModal(true); closeMobileMenu(); }}
                                        style={{ marginRight: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                                        title="View Profile"
                                    >
                                        <FaUser /> {user.name}
                                    </span>
                                    <button onClick={handleLogout} className="navbar-logout-btn"><FaSignOutAlt /></button>
                                </div>
                            ) : (
                                <Link to="/login" className="navbar-link" onClick={closeMobileMenu}>Login</Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            {showProfileModal && (
                <UserProfileModal user={user} onClose={() => setShowProfileModal(false)} />
            )}
        </>
    );
};

export default Navbar;
