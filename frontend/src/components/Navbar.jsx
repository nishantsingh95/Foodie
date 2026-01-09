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
    const { userLocation, openLocationModal } = useContext(LocationContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        navigate('/login');
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const handleSearch = (e) => {
        setSearchInput(e.target.value);
        if (setSearchTerm) {
            setSearchTerm(e.target.value);
        }
    };

    const isDelivery = user && user.role === 'delivery';

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-logo-container">
                        <Link to={isDelivery ? "/delivery" : "/"} className="navbar-link-logo" onClick={closeMobileMenu}>
                            <span className="navbar-logo-emoji">🍔</span>
                            <span className="navbar-logo-text">Foodie</span>
                        </Link>
                        <div className="navbar-location" onClick={() => { openLocationModal(); }} title={userLocation || "Click to change location"}>
                            <FaMapMarkerAlt className="location-icon" />
                            <span className="location-text">{userLocation || 'Locating...'}</span>
                        </div>
                    </div>

                    <div className="navbar-main-actions">
                        <div className="navbar-search-container">
                            {!isDelivery && (
                                <div className="navbar-search">
                                    <FaSearch className="search-icon" />
                                    <input
                                        type="text"
                                        placeholder="Search for food, etc..."
                                        className="navbar-search-input"
                                        value={searchInput}
                                        onChange={handleSearch}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="navbar-links-desktop">
                            {!isDelivery && <Link to="/" className="nav-link-item">Home</Link>}

                            {user && user.role === 'admin' && (
                                <>
                                    <Link to="/admin" className="nav-link-item">Owner</Link>
                                    <Link to="/admin/orders" className="nav-link-item">Orders</Link>
                                </>
                            )}
                            {user && user.role === 'delivery' && <Link to="/delivery" className="nav-link-item">Panel</Link>}
                            {user && user.role === 'user' && <Link to="/myorders" className="nav-link-item">My Orders</Link>}

                        </div>

                        <div className="navbar-utility-group">
                            {(!user || (user.role !== 'admin' && user.role !== 'delivery')) && (
                                <Link to="/cart" className="utility-btn cart-btn" onClick={closeMobileMenu}>
                                    <FaShoppingCart />
                                    {cartItems.length > 0 && (
                                        <span className="cart-badge">{cartItems.reduce((acc, item) => acc + item.qty, 0)}</span>
                                    )}
                                </Link>
                            )}
                            {user ? (
                                <div className="utility-btn profile-btn" onClick={() => { setShowProfileModal(true); closeMobileMenu(); }}>
                                    <FaUser />
                                </div>
                            ) : (
                                <Link to="/login" className="utility-btn login-btn" onClick={closeMobileMenu}>
                                    <FaUser />
                                </Link>
                            )}

                            {user && (
                                <button onClick={handleLogout} className="utility-btn logout-btn" title="Logout">
                                    <FaSignOutAlt />
                                    <span className="logout-text">Logout</span>
                                </button>
                            )}
                        </div>

                        <div className="navbar-mobile-toggle" onClick={toggleMobileMenu}>
                            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                        </div>
                    </div>

                    {/* Mobile Collapse Menu */}
                    <div className={`navbar-mobile-collapse ${isMobileMenuOpen ? 'active' : ''}`}>
                        <div className="mobile-links-container">
                            {!isDelivery && <Link to="/" className="mobile-link" onClick={closeMobileMenu}>Home</Link>}
                            {user && user.role === 'admin' && (
                                <>
                                    <Link to="/admin" className="mobile-link" onClick={closeMobileMenu}>Owner Dashboard</Link>
                                    <Link to="/admin/orders" className="mobile-link" onClick={closeMobileMenu}>Manage Orders</Link>
                                </>
                            )}
                            {user && user.role === 'delivery' && <Link to="/delivery" className="mobile-link" onClick={closeMobileMenu}>Delivery Panel</Link>}
                            {user && user.role === 'user' && <Link to="/myorders" className="mobile-link" onClick={closeMobileMenu}>My Order History</Link>}

                            {user && (
                                <button onClick={handleLogout} className="mobile-logout-link">
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
