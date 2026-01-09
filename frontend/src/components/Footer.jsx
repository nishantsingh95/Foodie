import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3>Foodie</h3>
                    <p>Delicious food delivered to your doorstep. Taste the best, forget the rest.</p>
                </div>
                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul className="footer-list">
                        <li><a href="#" className="footer-link">About Us</a></li>
                        <li><a href="#" className="footer-link">Contact</a></li>
                        <li><a href="#" className="footer-link">Terms & Conditions</a></li>
                        <li><a href="#" className="footer-link">Privacy Policy</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Connect with Us</h3>
                    <div className="footer-socials">
                        <a href="#" className="social-link"><FaFacebook /></a>
                        <a href="#" className="social-link"><FaTwitter /></a>
                        <a href="#" className="social-link"><FaInstagram /></a>
                        <a href="#" className="social-link"><FaLinkedin /></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2026 Foodie. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
