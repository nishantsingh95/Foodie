import React, { useState, useContext } from 'react';
import LocationContext from '../context/LocationContext';
import { FaMapMarkerAlt, FaTimes, FaCrosshairs } from 'react-icons/fa';

const LocationModal = () => {
    const { isModalOpen, closeLocationModal, setManualLocation, fetchLiveLocation, loading } = useContext(LocationContext);
    const [input, setInput] = useState('');

    if (!isModalOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            setManualLocation(input);
            setInput('');
        }
    };

    const handleUseLive = () => {
        fetchLiveLocation();
        closeLocationModal();
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h3>Select Location</h3>
                    <button onClick={closeLocationModal} style={styles.closeBtn}><FaTimes /></button>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="text"
                        placeholder="Enter your city/area..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        style={styles.input}
                        autoFocus
                    />
                    <button type="submit" style={styles.saveBtn}>Save Location</button>
                </form>

                <div style={styles.divider}>
                    <span>OR</span>
                </div>

                <button onClick={handleUseLive} style={styles.liveBtn} disabled={loading}>
                    <FaCrosshairs /> {loading ? 'Detecting...' : 'Use Current Live Location'}
                </button>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
    },
    modal: {
        backgroundColor: '#2f3542',
        padding: '2rem',
        borderRadius: '15px',
        width: '90%',
        maxWidth: '400px',
        color: '#fff',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        borderBottom: '1px solid #444',
        paddingBottom: '10px'
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        color: '#ff4757',
        fontSize: '1.2rem',
        cursor: 'pointer',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    input: {
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #444',
        backgroundColor: 'rgba(255,255,255,0.05)',
        color: '#fff',
        outline: 'none',
    },
    saveBtn: {
        padding: '12px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#ff4757',
        color: '#fff',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    divider: {
        margin: '1.5rem 0',
        textAlign: 'center',
        position: 'relative',
        color: '#777',
        fontSize: '0.9rem'
    },
    liveBtn: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #ff4757',
        backgroundColor: 'transparent',
        color: '#ff4757',
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        transition: 'all 0.2s',
    }
};

export default LocationModal;
