import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import API_URL from '../config/api';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const [forgotStep, setForgotStep] = useState(1);
    const [forgotEmail, setForgotEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, formData);
            login(res.data);
            toast.success('Login successful');

            if (res.data.role === 'admin') navigate('/admin');
            else if (res.data.role === 'delivery') navigate('/delivery');
            else navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        }
    };

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        try {
            if (forgotStep === 1) {
                await axios.post(`${API_URL}/api/auth/forgot-password`, { email: forgotEmail });
                toast.success('OTP sent to your email!');
                setForgotStep(2);
            } else {
                await axios.post(`${API_URL}/api/auth/reset-password`, { email: forgotEmail, otp, newPassword });
                toast.success('Password reset successful! Login now.');
                setShowForgot(false);
                setForgotStep(1);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error occurred');
        }
    };

    return (
        <div className="login-page" style={styles.container}>
            <div className="glass" style={styles.formContainer}>
                {!showForgot ? (
                    <>
                        <h1 style={styles.title}>Login</h1>
                        <form onSubmit={onSubmit}>
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
                            <button type="submit" style={styles.button}>Login</button>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    marginTop: '1rem'
                                }}
                            >
                                <span
                                    onClick={() => setShowForgot(true)}
                                    onMouseEnter={(e) => { e.target.style.textDecoration = 'underline'; e.target.style.color = '#ffa502'; }}
                                    onMouseLeave={(e) => { e.target.style.textDecoration = 'none'; e.target.style.color = '#ff4757'; }}
                                    style={{
                                        cursor: 'pointer',
                                        color: '#ff4757',
                                        fontSize: '0.95rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <FaLock size={12} /> Forgot Password?
                                </span>
                            </div>
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
                            Don't have an account? <Link to="/register" style={styles.link}>Register</Link>
                        </p>
                    </>
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%',
                            animation: 'fadeIn 0.5s ease-in-out'
                        }}
                    >
                        <div style={{
                            width: '100%',
                            padding: '20px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                        }}>
                            <h2 style={{
                                color: '#ff4757',
                                marginBottom: '1.5rem',
                                textAlign: 'center',
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}>
                                <FaLock style={{ marginBottom: '10px', display: 'block', margin: '0 auto' }} size={30} />
                                Reset Password
                            </h2>
                            <form onSubmit={handleForgotSubmit}>
                                {forgotStep === 1 ? (
                                    <>
                                        <div style={styles.inputGroup}>
                                            <label style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Email Address</label>
                                            <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required style={styles.input} />
                                        </div>
                                        <button type="submit" style={{ ...styles.button, background: 'linear-gradient(45deg, #ff4757, #ff6b81)', boxShadow: '0 4px 15px rgba(255, 71, 87, 0.4)' }}>Send OTP</button>
                                    </>
                                ) : (
                                    <>
                                        <div style={styles.inputGroup}>
                                            <label style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Enter OTP</label>
                                            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required style={{ ...styles.input, textAlign: 'center', letterSpacing: '5px', fontSize: '1.2rem' }} placeholder="------" maxLength="6" />
                                        </div>
                                        <div style={styles.inputGroup}>
                                            <label style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>New Password</label>
                                            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={styles.input} />
                                        </div>
                                        <button type="submit" style={{ ...styles.button, background: 'linear-gradient(45deg, #2ed573, #7bed9f)', color: '#fff' }}>Reset Password</button>
                                    </>
                                )}
                                <p
                                    style={{
                                        textAlign: 'center',
                                        marginTop: '1.5rem',
                                        cursor: 'pointer',
                                        color: '#ccc',
                                        fontSize: '0.9rem',
                                        textDecoration: 'underline',
                                        transition: 'color 0.3s'
                                    }}
                                    onClick={() => setShowForgot(false)}
                                    onMouseEnter={(e) => e.target.style.color = '#fff'}
                                    onMouseLeave={(e) => e.target.style.color = '#ccc'}
                                >
                                    Back to Login
                                </p>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    formContainer: {
        padding: '2rem',
        width: '400px',
        color: '#fff',
        position: 'relative',
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
        boxSizing: 'border-box', // Ensure padding is included in width
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
        cursor: 'pointer',
    },
    link: {
        color: '#ff4757',
        textDecoration: 'none',
    }
};

export default Login;
