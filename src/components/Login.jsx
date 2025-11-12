import React, { useState, useEffect } from 'react';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/theme.js';
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const normalizedEmail = email.trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === normalizedEmail && u.password === password);

    if (user) {
      localStorage.setItem('currentUser', normalizedEmail);
      window.location.href = '/index.html';
    } else {
      setError('Incorrect email or password.');
    }
  };

  return (
    <div className="login-page">
      <header className="nav">
        <div className="container nav-inner">
          <div className="brand">
            <img id="logo-img" src="/images/cat.png" height="100" width="120" alt="Catifyy Logo" />
          </div>

          <div className="search-wrap">
            <form className="search" onSubmit={(e) => e.preventDefault()}>
              <i className="fa-solid fa-circle fa-xs" style={{ color: '#000000' }}></i>
              <input id="q" name="q" placeholder="Search songs, artists, albums..." />
            </form>
            <div className="filters">
              <div className="filter-group">
                <input type="radio" name="scope" id="f-songs" />
                <label className="chip" htmlFor="f-songs"><a href="songs.html">Songs</a></label>
                
                <input type="radio" name="scope" id="f-albums" />
                <label className="chip" htmlFor="f-albums"><a href="albums.html">Albums</a></label>
              
                <input type="radio" name="scope" id="f-library" />
                <label className="chip" htmlFor="f-library"><a href="library.html">Library</a></label>

                <input type="radio" name="scope" id="f-playlists" />
                <label className="chip" htmlFor="f-playlists"><a href="playlist.html">Playlist</a></label>
                
                <input type="radio" name="scope" id="f-liked" />
                <label className="chip" htmlFor="f-liked"><a href="liked.html">Liked</a></label>
              </div>
            </div>
          </div>

          <nav className="nav-links">
            <a href="index.html" title="Home"><i className="fa-solid fa-house-user"></i></a>
            <a href="create.html" title="Create Playlist"><i className="fa-solid fa-plus"></i></a>
            <button id="theme-toggle" className="nav-toggle" title="Toggle theme" aria-label="Toggle theme">
              <i id="theme-icon" className="fa-solid fa-moon"></i>
            </button>
            <a href="signup.html" title="Login"><i className="fa-solid fa-user"></i></a>
          </nav>
        </div>
      </header>

      <main className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Sign in to continue your playlist journey</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="login-btn">
              <i className="fa-solid fa-right-to-bracket"></i>
              Sign In
            </button>

            {error && (
              <div style={{ 
                color: '#e25', 
                marginTop: '12px', 
                fontSize: '14px',
                textAlign: 'center' 
              }}>
                {error}
              </div>
            )}

            <div className="forgot-password">
              <a href="#">Forgot your password?</a>
            </div>
          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <div className="signup-link">
            <p>Don't have an account? <a href="signup.html">Create an account</a></p>
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
