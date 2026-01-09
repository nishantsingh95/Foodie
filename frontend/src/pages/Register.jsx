import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import API_URL from '../config/api';
import './Auth.css';

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
        <div className="auth-page">
            <div className="glass auth-container">
                <h1 className="auth-title">Register</h1>
                <form onSubmit={onSubmit}>
                    <div className="auth-input-group">
                        <label className="auth-label">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={onChange}
                            required
                            className="auth-input"
                        />
                    </div>
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
                                minLength="6"
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
                    <div className="auth-input-group">
                        <label className="auth-label">Role</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {['user', 'delivery', 'admin'].map((r) => (
                                <label
                                    key={r}
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '10px',
                                        backgroundColor: role === r ? '#ff4757' : 'rgba(255,255,255,0.9)',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        color: role === r ? '#fff' : '#333',
                                        border: role === r ? '2px solid #ff4757' : '2px solid transparent'
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value={r}
                                        checked={role === r}
                                        onChange={onChange}
                                        style={{ display: 'none' }}
                                    />
                                    <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                                        {r === 'admin' ? 'Owner' : r}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="auth-input-group">
                        <label className="auth-label">Address</label>
                        <textarea
                            name="address"
                            value={address}
                            onChange={onChange}
                            className="auth-input"
                            rows="2"
                            required
                        />
                    </div>
                    <button type="submit" className="auth-btn">Register</button>

                    <div className="auth-divider">
                        <div className="auth-divider-line"></div>
                        <span className="auth-divider-text">OR</span>
                        <div className="auth-divider-line"></div>
                    </div>

                    <button
                        type="button"
                        onClick={() => window.location.href = `${API_URL}/api/auth/google`}
                        className="auth-google-btn"
                    >
                        <FcGoogle size={24} /> Sign up with Google
                    </button>

                    <p className="auth-footer">
                        Already have an account? <Link to="/login" className="auth-link">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
