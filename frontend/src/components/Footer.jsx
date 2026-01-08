import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                <div style={styles.section}>
                    <h3>Foodie</h3>
                    <p>Delicious food delivered to your doorstep. Taste the best, forget the rest.</p>
                </div>
                <div style={styles.section}>
                    <h3>Quick Links</h3>
                    <ul style={styles.list}>
                        <li><a href="#" style={styles.link}>About Us</a></li>
                        <li><a href="#" style={styles.link}>Contact</a></li>
                        <li><a href="#" style={styles.link}>Terms & Conditions</a></li>
                        <li><a href="#" style={styles.link}>Privacy Policy</a></li>
                    </ul>
                </div>
                <div style={styles.section}>
                    <h3>Connect with Us</h3>
                    <div style={styles.socials}>
                        <a href="#" style={styles.socialLink}><FaFacebook /></a>
                        <a href="#" style={styles.socialLink}><FaTwitter /></a>
                        <a href="#" style={styles.socialLink}><FaInstagram /></a>
                        <a href="#" style={styles.socialLink}><FaLinkedin /></a>
                    </div>
                </div>
            </div>
            <div style={styles.bottom}>
                <p>&copy; 2026 Foodie. All rights reserved.</p>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: '#1e272e',
        color: '#fff',
        padding: '3rem 2rem 1rem 2rem',
        marginTop: 'auto',
        borderTop: '1px solid #444',
    },
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    section: {
        display: 'flex',
        flexDirection: 'column',
    },
    list: {
        listStyle: 'none',
        padding: 0,
    },
    link: {
        color: '#ccc',
        textDecoration: 'none',
        lineHeight: '2',
        transition: 'color 0.3s',
    },
    socials: {
        display: 'flex',
        gap: '15px',
        fontSize: '1.5rem',
    },
    socialLink: {
        color: '#fff',
        transition: 'color 0.3s',
    },
    bottom: {
        textAlign: 'center',
        marginTop: '3rem',
        paddingTop: '1rem',
        borderTop: '1px solid #444',
        color: '#777',
    },
};

export default Footer;
