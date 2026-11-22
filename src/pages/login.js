import React, { useState } from 'react';
import {
  Hotel, Mail, Lock, LogIn, X, Eye, EyeOff,
  QrCode, ChefHat, ConciergeBell, UtensilsCrossed,
} from 'lucide-react';
import './login.css';
import {  useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  // ✅ CENTRAL BACKEND
  const API = process.env.REACT_APP_API;

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API}/api/hotel/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      if (result.success) {
        // ✅ Store hotel data safely
        localStorage.setItem('hotelUser', JSON.stringify(result.data));

        // ✅ Redirect to admin
        navigate('/admin');
      } else {
        setErrors({ server: result.message || "Invalid credentials" });
      }

    } catch (error) {
      setErrors({
        server: error.message || "Server error. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert('Password reset functionality will be implemented soon!');
  };

  const closeComingSoon = () => {
    setShowComingSoon(false);
  };

  return (
    <div className="login-page">

      {/* ============ LEFT — BRAND VISUAL ============ */}
      <div className="login-visual">
        <div className="login-visual-inner">
          <div className="brand-badge">
            <span className="brand-badge-icon">
              <UtensilsCrossed size={20} />
            </span>
            <span className="brand-badge-name">CafeOS</span>
          </div>

          <h1 className="visual-title">
            Run your restaurant <em>beautifully.</em>
          </h1>

          <p className="visual-subtitle">
            The all-in-one platform for table ordering, kitchen tickets,
            room service and billing.
          </p>

          <ul className="visual-features">
            <li>
              <span className="feature-icon"><QrCode size={18} /></span>
              QR-based table ordering
            </li>
            <li>
              <span className="feature-icon"><ChefHat size={18} /></span>
              Live kitchen tickets (KOT)
            </li>
            <li>
              <span className="feature-icon"><ConciergeBell size={18} /></span>
              Room service &amp; billing
            </li>
          </ul>
        </div>

        <div className="visual-glow glow-1" />
        <div className="visual-glow glow-2" />
        <div className="visual-glow glow-3" />
      </div>

      {/* ============ RIGHT — LOGIN FORM ============ */}
      <div className="login-panel">
        <div className="login-panel-inner">

          <div className="login-head">
            <h2>Welcome back</h2>
            <p>Login to your hotel dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">

            {/* EMAIL */}
            <div className="input-groupE">
              <label htmlFor="email">
                <Mail size={18} />
                <span>Email</span>
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
                autoComplete="email"
              />

              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            {/* PASSWORD */}
            <div className="input-groupE">
              <label htmlFor="password">
                <Lock size={18} />
                <span>Password</span>
              </label>

              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={errors.password ? 'error' : ''}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="forgot-password">
              <a href="/forgot-password" onClick={handleForgotPassword}>
                Forgot Password?
              </a>
            </div>

            {errors.server && (
              <div className="error-banner">
                {errors.server}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Login</span>
                </>
              )}
            </button>
          </form>

          <div className="signup-link">
            Don't have an account? <a href="/signup" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>Sign up</a>
          </div>
        </div>
      </div>

      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="modal-overlay" onClick={closeComingSoon}>
          <div
            className="coming-soon-modal"
            onClick={e => e.stopPropagation()}
          >
            <button className="close-button" onClick={closeComingSoon}>
              <X size={24} />
            </button>

            <div className="coming-soon-content">
              <Hotel size={64} className="coming-soon-icon" />
              <h2>Coming Soon!</h2>
              <p>Hotel registration feature is under development.</p>
              <button className="notify-button" onClick={closeComingSoon}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
