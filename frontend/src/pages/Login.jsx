import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import API_URL from '../config/api';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

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
        <div className="auth-page">
            <div className="glass auth-container">
                {!showForgot ? (
                    <>
                        <h1 className="auth-title">Login</h1>
                        <form onSubmit={onSubmit}>
                            <div className="auth-input-group">
                                <label className="auth-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                    required
                                    className="auth-input"
                                />
                            </div>
                            <div className="auth-input-group">
                                <label className="auth-label">Password</label>
                                <div className="auth-password-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={password}
                                        onChange={onChange}
                                        required
                                        className="auth-input"
                                    />
                                    <span
                                        className="auth-eye-icon"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                            </div>
                            <button type="submit" className="auth-btn">Login</button>

                            <div className="auth-forgot-link">
                                <span
                                    className="auth-forgot-text"
                                    onClick={() => setShowForgot(true)}
                                >
                                    <FaLock size={12} /> Forgot Password?
                                </span>
                            </div>
                        </form>

                        <div className="auth-divider">
                            <div className="auth-divider-line"></div>
                            <span className="auth-divider-text">OR</span>
                            <div className="auth-divider-line"></div>
                        </div>

                        <button
                            onClick={() => window.location.href = `${API_URL}/api/auth/google`}
                            className="auth-google-btn"
                        >
                            <FcGoogle size={24} /> Sign in with Google
                        </button>

                        <p className="auth-footer">
                            Don't have an account? <Link to="/register" className="auth-link">Register</Link>
                        </p>
                    </>
                ) : (
                    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                        <h2 className="auth-title">
                            <FaLock style={{ marginBottom: '10px', display: 'block', margin: '0 auto' }} size={30} />
                            Reset Password
                        </h2>
                        <form onSubmit={handleForgotSubmit}>
                            {forgotStep === 1 ? (
                                <>
                                    <div className="auth-input-group">
                                        <label className="auth-label">Email Address</label>
                                        <input
                                            type="email"
                                            value={forgotEmail}
                                            onChange={(e) => setForgotEmail(e.target.value)}
                                            required
                                            className="auth-input"
                                        />
                                    </div>
                                    <button type="submit" className="auth-btn">Send OTP</button>
                                </>
                            ) : (
                                <>
                                    <div className="auth-input-group">
                                        <label className="auth-label">Enter OTP</label>
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                            className="auth-input"
                                            style={{ textAlign: 'center', letterSpacing: '5px', fontSize: '1.2rem' }}
                                            placeholder="------"
                                            maxLength="6"
                                        />
                                    </div>
                                    <div className="auth-input-group">
                                        <label className="auth-label">New Password</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            className="auth-input"
                                        />
                                    </div>
                                    <button type="submit" className="auth-btn" style={{ background: 'linear-gradient(45deg, #2ed573, #7bed9f)' }}>Reset Password</button>
                                </>
                            )}
                            <p
                                className="auth-footer"
                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                onClick={() => setShowForgot(false)}
                            >
                                Back to Login
                            </p>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
