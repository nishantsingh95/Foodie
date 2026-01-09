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
                        <div className="navbar-location" onClick={() => { openLocationModal(); }} title={userLocation || "Click to change location"}>
                            <FaMapMarkerAlt className="location-icon" />
                            <span className="location-text">{userLocation || 'Locating...'}</span>
                        </div>
                    </div>

                    <div className="navbar-utility">
                        {(!user || (user.role !== 'admin' && user.role !== 'delivery')) && (
                            <Link to="/cart" className="utility-icon cart-link" onClick={closeMobileMenu}>
                                <FaShoppingCart />
                                {cartItems.length > 0 && (
                                    <span className="navbar-cart-badge">{cartItems.reduce((acc, item) => acc + item.qty, 0)}</span>
                                )}
                            </Link>
                        )}
                        {user ? (
                            <div className="utility-icon profile-icon" onClick={() => { setShowProfileModal(true); closeMobileMenu(); }}>
                                <FaUser />
                            </div>
                        ) : (
                            <Link to="/login" className="utility-icon login-icon" onClick={closeMobileMenu}>
                                <FaUser />
                            </Link>
                        )}
                    </div>

                    <div className="navbar-search-container">
                        <div className="navbar-mobile-toggle" onClick={toggleMobileMenu}>
                            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                        </div>
                        {!isDelivery && (
                            <div className="navbar-search">
                                <FaSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search for restaurants, items..."
                                    className="navbar-search-input"
                                    value={searchInput}
                                    onChange={handleSearch}
                                />
                            </div>
                        )}
                    </div>

                    <div className={`navbar-collapse ${isMobileMenuOpen ? 'active' : ''}`}>
                        <div className="navbar-links">
                            {!isDelivery && <Link to="/" className="navbar-link" onClick={closeMobileMenu}>Home</Link>}

                            {user && (
                                <span className="navbar-link" style={{ cursor: 'pointer' }} onClick={() => { setShowProfileModal(true); closeMobileMenu(); }}>
                                    My Profile
                                </span>
                            )}

                            {user && user.role === 'admin' && (
                                <>
                                    <Link to="/admin" className="navbar-link" onClick={closeMobileMenu}>Owner Dashboard</Link>
                                    <Link to="/admin/orders" className="navbar-link" onClick={closeMobileMenu}>Manage Orders</Link>
                                </>
                            )}
                            {user && user.role === 'delivery' && <Link to="/delivery" className="navbar-link" onClick={closeMobileMenu}>Delivery Panel</Link>}
                            {user && user.role === 'user' && <Link to="/myorders" className="navbar-link" onClick={closeMobileMenu}>My Order History</Link>}

                            {user && (
                                <button onClick={handleLogout} className="navbar-mobile-logout-btn">
                                    <FaSignOutAlt /> Logout
                                </button>
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
