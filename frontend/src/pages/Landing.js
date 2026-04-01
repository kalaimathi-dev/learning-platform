import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStoredTheme, toggleTheme, applyTheme } from '../utils/theme';

const Landing = () => {
  const [theme, setTheme] = useState(getStoredTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <div className="landing-page">
      {/* Public Navbar */}
      <nav className="public-navbar">
        <div className="navbar-logo">EDSL <span>Platform</span></div>
        <div className="public-navbar-links">
          <a href="#features">Features</a>
          <button
            type="button"
            className="nav-btn nav-btn-outline"
            onClick={() => setTheme(toggleTheme())}
            style={{ padding: '0.45rem 0.9rem', display: 'flex', alignItems: 'center' }}
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            ) : (
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            )}
          </button>
          <Link to="/login" className="nav-btn nav-btn-outline">Login</Link>
          <Link to="/register" className="nav-btn nav-btn-filled">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <span className="hero-badge">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
          Experience-Driven Learning
        </span>
        <h1>
          Learn <span className="highlight">Strategically</span> Based on Your Experience
        </h1>
        <p>
          A personalized learning platform that adapts to your skills, interests, and goals. Track your progress and master new technologies.
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="btn-primary">
            Start Learning Free
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
          <Link to="/login" className="btn-outline">I Have an Account</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <h2>Why Choose Our Platform?</h2>
        <p className="section-subtitle">Built for modern learners who want personalized education</p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon blue">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
            </div>
            <h3>Personalized Recommendations</h3>
            <p>Get course suggestions based on your interests and learning history. Our algorithm adapts to your needs.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon green">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h3>Track Your Progress</h3>
            <p>Monitor your learning journey with detailed progress tracking. See how far you've come and what's next.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon amber">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <h3>Structured Learning Paths</h3>
            <p>Follow curated module-based courses designed by experts. Learn step by step at your own pace.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p><strong>EDSL Platform</strong> — Experience-Driven Strategic Learning</p>
        <p className="footer-muted">© 2024 Mini Project. Built with React & Node.js</p>
      </footer>
    </div>
  );
};

export default Landing;
