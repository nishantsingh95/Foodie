import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import API_URL from '../config/api';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
        address: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const { name, email, password, role, address } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/api/auth/register`, formData);
            login(res.data);
            toast.success('Registration successful');

            if (res.data.role === 'admin') navigate('/admin');
            else if (res.data.role === 'delivery') navigate('/delivery');
            else navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="register-page" style={styles.container}>
            <div className="glass" style={styles.formContainer}>
                <h1 style={styles.title}>Register</h1>
                <form onSubmit={onSubmit}>
                    <div style={styles.inputGroup}>
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={onChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={password}
                                onChange={onChange}
                                required
                                style={styles.input}
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    cursor: 'pointer',
                                    color: '#333'
                                }}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={{ marginBottom: '10px', display: 'block' }}>Role</label>
                        <div style={styles.radioGroup}>
                            <label
                                style={{
                                    ...styles.radioLabel,
                                    backgroundColor: role === 'user' ? '#ff4757' : 'rgba(255,255,255,0.9)',
                                    border: role === 'user' ? '2px solid #ff4757' : '2px solid transparent',
                                    transform: role === 'user' ? 'scale(1.05)' : 'scale(1)',
                                    boxShadow: role === 'user' ? '0 4px 15px rgba(255, 71, 87, 0.3)' : 'none',
                                }}
                                onMouseEnter={(e) => {
                                    if (role !== 'user') {
                                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,1)';
                                        e.currentTarget.style.transform = 'scale(1.02)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (role !== 'user') {
                                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }
                                }}
                            >
                                <input
                                    type="radio"
                                    name="role"
                                    value="user"
                                    checked={role === 'user'}
                                    onChange={onChange}
                                    style={styles.radio}
                                />
                                <span style={{ ...styles.radioText, color: role === 'user' ? '#fff' : '#333' }}>👤 User</span>
                            </label>
                            <label
                                style={{
                                    ...styles.radioLabel,
                                    backgroundColor: role === 'delivery' ? '#ff4757' : 'rgba(255,255,255,0.9)',
                                    border: role === 'delivery' ? '2px solid #ff4757' : '2px solid transparent',
                                    transform: role === 'delivery' ? 'scale(1.05)' : 'scale(1)',
                                    boxShadow: role === 'delivery' ? '0 4px 15px rgba(255, 71, 87, 0.3)' : 'none',
                                }}
                                onMouseEnter={(e) => {
                                    if (role !== 'delivery') {
                                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,1)';
                                        e.currentTarget.style.transform = 'scale(1.02)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (role !== 'delivery') {
                                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }
                                }}
                            >
                                <input
                                    type="radio"
                                    name="role"
                                    value="delivery"
                                    checked={role === 'delivery'}
                                    onChange={onChange}
                                    style={styles.radio}
                                />
                                <span style={{ ...styles.radioText, color: role === 'delivery' ? '#fff' : '#333' }}>🏍️ Delivery</span>
                            </label>
                            <label
                                style={{
                                    ...styles.radioLabel,
                                    backgroundColor: role === 'admin' ? '#ff4757' : 'rgba(255,255,255,0.9)',
                                    border: role === 'admin' ? '2px solid #ff4757' : '2px solid transparent',
                                    transform: role === 'admin' ? 'scale(1.05)' : 'scale(1)',
                                    boxShadow: role === 'admin' ? '0 4px 15px rgba(255, 71, 87, 0.3)' : 'none',
                                }}
                                onMouseEnter={(e) => {
                                    if (role !== 'admin') {
                                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,1)';
                                        e.currentTarget.style.transform = 'scale(1.02)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (role !== 'admin') {
                                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }
                                }}
                            >
                                <input
                                    type="radio"
                                    name="role"
                                    value="admin"
                                    checked={role === 'admin'}
                                    onChange={onChange}
                                    style={styles.radio}
                                />
                                <span style={{ ...styles.radioText, color: role === 'admin' ? '#fff' : '#333' }}>👔 Owner</span>
                            </label>
                        </div>
                    </div>
                    <div style={styles.inputGroup}>
                        <label>Address</label>
                        <textarea
                            name="address"
                            value={address}
                            onChange={onChange}
                            style={styles.input}
                            rows="2"
                        />
                    </div>
                    <button type="submit" style={styles.button}>Register</button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.3)' }}></div>
                    <span style={{ padding: '0 10px', color: '#ccc', fontSize: '0.9rem' }}>OR</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.3)' }}></div>
                </div>

                <button
                    onClick={() => window.location.href = `${API_URL}/api/auth/google`}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'white',
                        color: '#333',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        fontWeight: '500',
                        transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                    <FcGoogle size={24} /> Sign in with Google
                </button>

                <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    Already have an account? <Link to="/login" style={styles.link}>Login</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    formContainer: {
        padding: '2rem',
        width: '400px',
        color: '#fff',
        marginTop: '2rem',
        marginBottom: '2rem'
    },
    title: {
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#ff4757',
    },
    inputGroup: {
        marginBottom: '1rem',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: 'none',
        marginTop: '5px',
        backgroundColor: 'rgba(255,255,255,0.9)',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#ff4757',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '1rem',
        marginTop: '1rem',
        cursor: 'pointer'
    },
    link: {
        color: '#ff4757',
        textDecoration: 'none',
    },
    radioGroup: {
        display: 'flex',
        flexDirection: 'row',
        gap: '10px',
        marginTop: '8px',
    },
    radioLabel: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px 10px',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '2px solid transparent',
        position: 'relative',
        overflow: 'hidden',
    },
    radio: {
        position: 'absolute',
        opacity: 0,
        cursor: 'pointer',
    },
    radioText: {
        color: '#333',
        fontSize: '0.95rem',
        fontWeight: '600',
        textAlign: 'center',
        transition: 'color 0.3s ease',
    }
};

export default Register;
