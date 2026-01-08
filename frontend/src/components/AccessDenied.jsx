import React from 'react';
import { Link } from 'react-router-dom';
import { FaLock, FaHome } from 'react-icons/fa';

const AccessDenied = () => {
    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <FaLock size={80} color="#ff4757" style={{ marginBottom: '20px' }} />
                <h1 style={styles.title}>Access Denied</h1>
                <p style={styles.message}>
                    You do not have permission to view this page. <br />
                    This area is restricted to administrators only.
                </p>
                <Link to="/" style={styles.button}>
                    <FaHome style={{ marginRight: '8px' }} /> Return Home
                </Link>
            </div>
        </div>
    );
};

const styles = {
    container: {
        height: '100vh',
        backgroundColor: '#1e272e',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
    },
    content: {
        textAlign: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: '3rem',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        maxWidth: '400px',
        width: '90%',
    },
    title: {
        fontSize: '2rem',
        marginBottom: '1rem',
        color: '#ff4757',
    },
    message: {
        color: '#ccc',
        marginBottom: '2rem',
        lineHeight: '1.6',
    },
    button: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '12px 24px',
        backgroundColor: '#ffa502',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '50px',
        fontWeight: 'bold',
        transition: 'transform 0.2s',
    }
};

export default AccessDenied;
