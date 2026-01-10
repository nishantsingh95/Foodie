import React from 'react';
import { FaUser, FaEnvelope, FaIdBadge, FaTimes, FaCrown, FaUserCircle } from 'react-icons/fa';

const UserProfileModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} style={styles.closeBtn} title="Close">
                    <FaTimes />
                </button>

                <div style={styles.headerBanner}>
                    <div style={styles.avatarWrapper}>
                        <div style={styles.avatar}>
                            <FaUser size={40} color="#fff" />
                        </div>
                    </div>
                </div>

                <div style={styles.content}>
                    <h2 style={styles.userName}>{user.name}</h2>
                    <p style={styles.userRole}>
                        {user.role === 'admin' ? <FaCrown style={{ color: '#f1c40f', marginRight: '5px' }} /> : <FaUserCircle style={{ marginRight: '5px' }} />}
                        {user.role}
                    </p>

                    <div style={styles.divider}></div>

                    <div style={styles.infoContainer}>
                        <div style={styles.infoRow}>
                            <div style={styles.iconBox}><FaEnvelope /></div>
                            <div style={styles.infoText}>
                                <label style={styles.label}>Email Address</label>
                                <p style={styles.value}>{user.email}</p>
                            </div>
                        </div>

                        <div style={styles.infoRow}>
                            <div style={styles.iconBox}><FaIdBadge /></div>
                            <div style={styles.infoText}>
                                <label style={styles.label}>User ID</label>
                                <p style={styles.value} title={user._id}>#{user._id?.slice(-6).toUpperCase() || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
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
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
        animation: 'fadeIn 0.3s ease',
    },
    modal: {
        background: 'var(--card-bg)',
        width: '90%',
        maxWidth: '380px',
        borderRadius: '20px',
        color: 'var(--text)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(255, 71, 87, 0.2)',
        overflow: 'visible',
        position: 'relative',
        border: '1px solid var(--border)',
        animation: 'slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    closeBtn: {
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'rgba(255,255,255,0.1)',
        border: 'none',
        color: 'var(--text)',
        fontSize: '1rem',
        cursor: 'pointer',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        zIndex: 10,
    },
    headerBanner: {
        height: '100px',
        background: 'linear-gradient(to right, #ff4757, #ff6b81)',
        borderRadius: '20px 20px 0 0',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    avatarWrapper: {
        marginBottom: '-40px',
        padding: '5px',
        background: 'var(--bg)', // Match modal bg
        borderRadius: '50%',
    },
    avatar: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #2d3436, #000000)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: 'inner 0 0 10px rgba(0,0,0,0.5)',
        border: '2px solid #ff4757',
    },
    content: {
        padding: '3rem 2rem 2rem', // Top padding accounts for avatar overlap
        textAlign: 'center',
    },
    userName: {
        margin: '10px 0 5px',
        fontSize: '1.6rem',
        fontWeight: '700',
        letterSpacing: '0.5px',
    },
    userRole: {
        color: 'var(--text)',
        fontSize: '0.95rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontWeight: '600',
    },
    divider: {
        height: '1px',
        background: 'linear-gradient(to right, transparent, #444, transparent)',
        margin: '20px 0',
    },
    infoContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    infoRow: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'var(--bg)',
        padding: '12px',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        transition: 'background 0.2s',
    },
    iconBox: {
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        backgroundColor: 'rgba(255, 71, 87, 0.1)',
        color: '#ff4757',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.1rem',
        marginRight: '15px',
    },
    infoText: {
        textAlign: 'left',
    },
    label: {
        display: 'block',
        fontSize: '0.75rem',
        color: '#888',
        textTransform: 'uppercase',
        marginBottom: '2px',
    },
    value: {
        fontSize: '1rem',
        color: 'var(--text)',
        fontWeight: '500',
        margin: 0,
        wordBreak: 'break-all', // Handle long emails
    }
};

// Add keyframes for animations
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
`;
document.head.appendChild(styleSheet);

export default UserProfileModal;
