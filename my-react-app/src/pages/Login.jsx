import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [logoSrc, setLogoSrc] = useState('./images/cat.png');
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const isDark = savedTheme === 'dark';
    setIsDarkTheme(isDark);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeName) => {
    const root = document.documentElement;
    
    if (themeName === 'dark') {
      root.style.setProperty('--bg', '#1a1d2e');
      root.style.setProperty('--surface', '#252941');
      root.style.setProperty('--text', '#e1e6f0');
      root.style.setProperty('--primary', '#7c96ff');
      root.style.setProperty('--accent', '#ff8db1');
      root.style.setProperty('--shadow-dark', 'rgba(0, 0, 0, 0.5)');
      root.style.setProperty('--shadow-light', 'rgba(124, 150, 255, 0.08)');
      setLogoSrc('./images/image.png');
    } else {
      root.style.setProperty('--bg', '#eaf1ff');
      root.style.setProperty('--surface', '#f6f8ff');
      root.style.setProperty('--text', '#2d3348');
      root.style.setProperty('--primary', '#6e85ff');
      root.style.setProperty('--accent', '#ff8db1');
      root.style.setProperty('--shadow-dark', '#ccd6ec');
      root.style.setProperty('--shadow-light', '#ffffff');
      setLogoSrc('./images/cat.png');
    }
  };

  const toggleTheme = () => {
    const newTheme = isDarkTheme ? 'light' : 'dark';
    setIsDarkTheme(!isDarkTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      // Signup validation
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        alert('Please fill in all fields');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      if (formData.password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
      }

      // Save user data
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('catifyy_user', JSON.stringify(userData));
      alert('Account created successfully! Welcome to Catifyy 🎵');
      navigate('/');
    } else {
      // Login validation
      if (!formData.email || !formData.password) {
        alert('Please enter your email and password');
        return;
      }

      const savedUser = JSON.parse(localStorage.getItem('catifyy_user') || '{}');

      if (savedUser.email === formData.email && savedUser.password === formData.password) {
        alert(`Welcome back, ${savedUser.name}! 🎵`);
        navigate('/');
      } else {
        alert('Invalid email or password. Please try again or sign up for a new account.');
      }
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="login-page">
      <header className="nav">
        <div className="container nav-inner">
          <div className="brand">
            <img src={logoSrc} height="100" width="120" alt="Catifyy Logo" />
          </div>

          <nav className="nav-links">
            <Link to="/" title="Home">
              <i className="fa-solid fa-house-user"></i>
            </Link>
            <button onClick={toggleTheme} className="nav-toggle" title="Toggle theme" aria-label="Toggle theme">
              <i className={`fa-solid ${isDarkTheme ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
          </nav>
        </div>
      </header>

      <main className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <img src={logoSrc} alt="Catifyy" />
            </div>
            <h1>{isSignup ? 'Create Account' : 'Welcome Back'}</h1>
            <p>{isSignup ? 'Join Catifyy and start your musical journey' : 'Sign in to continue your musical journey'}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {isSignup && (
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  <i className="fa-solid fa-user"></i>
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={isSignup}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <i className="fa-solid fa-envelope"></i>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <i className="fa-solid fa-lock"></i>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            {isSignup && (
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  <i className="fa-solid fa-lock"></i>
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-input"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={isSignup}
                />
              </div>
            )}

            {!isSignup && (
              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>
            )}

            <button type="submit" className="submit-btn">
              {isSignup ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="login-divider">
            <span>OR</span>
          </div>

          <div className="social-login">
            <button className="social-btn google-btn">
              <i className="fa-brands fa-google"></i>
              Continue with Google
            </button>
            <button className="social-btn facebook-btn">
              <i className="fa-brands fa-facebook"></i>
              Continue with Facebook
            </button>
            <button className="social-btn apple-btn">
              <i className="fa-brands fa-apple"></i>
              Continue with Apple
            </button>
          </div>

          <div className="login-footer">
            <p>
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button onClick={toggleMode} className="toggle-mode-btn">
                {isSignup ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        <div className="features-section">
          <h2>Why Catifyy?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fa-solid fa-music"></i>
              </div>
              <h3>Unlimited Music</h3>
              <p>Access millions of songs from your favorite artists</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fa-solid fa-list"></i>
              </div>
              <h3>Custom Playlists</h3>
              <p>Create and share playlists with friends</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fa-solid fa-heart"></i>
              </div>
              <h3>Save Favorites</h3>
              <p>Build your personal music library</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fa-solid fa-download"></i>
              </div>
              <h3>Offline Mode</h3>
              <p>Download songs and listen anywhere</p>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <div className="container footer-grid">
          <div className="footer-links">
            <a href="#">About</a>
            <a href="#">Help</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
          </div>
          <div className="social" aria-label="Social media">
            <a href="#" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M4 4h3l5 7l5-7h3l-7.5 10L20 20h-3l-5-7l-5 7H4l7.5-10z"/>
              </svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm5 3a5 5 0 1 1 0 10a5 5 0 0 1 0-10m0 2.2A2.8 2.8 0 1 0 14.8 12A2.8 2.8 0 0 0 12 9.2M18 6.5a1 1 0 1 1-1 1a1 1 0 0 1 1-1"/>
              </svg>
            </a>
            <a href="#" aria-label="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M10 15V9l5 3m8-6.5v9A3.5 3.5 0 0 1 19.5 18h-15A3.5 3.5 0 0 1 1 14.5v-9A3.5 3.5 0 0 1 4.5 2h15A3.5 3.5 0 0 1 23 5.5"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
