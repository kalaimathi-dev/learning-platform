import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    experienceLevel: 'Beginner',
    interests: []
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const interestOptions = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Cloud Computing',
    'Cybersecurity'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleInterest = (interest) => {
    const updated = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest];
    setFormData({ ...formData, interests: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.interests.length === 0) {
      setError('Please select at least one interest');
      return;
    }

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        experienceLevel: formData.experienceLevel,
        interests: formData.interests
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect based on user role
      const isAdmin = response.data.user.role === 'admin';
      navigate(isAdmin ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '480px' }}>
        <div className="auth-logo">
          <h2>EDSL <span>Platform</span></h2>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '56px', height: '56px', margin: '0 auto 1rem',
            background: 'var(--primary-light)', borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="var(--primary)" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          </div>
        </div>

        <h3>Create Account</h3>
        <p className="auth-subtitle">Start your personalized learning journey</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-input" type="text" name="name" value={formData.name}
              onChange={handleChange} required placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input className="form-input" type="email" name="email" value={formData.email}
              onChange={handleChange} required placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-input" type="password" name="password" value={formData.password}
              onChange={handleChange} required placeholder="Min. 6 characters" />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input className="form-input" type="password" name="confirmPassword" value={formData.confirmPassword}
              onChange={handleChange} required placeholder="Re-enter password" />
          </div>

          <div className="form-group">
            <label>Experience Level</label>
            <select
              className="form-input"
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label>Your Interests</label>
            <div className="interests-grid">
              {interestOptions.map(interest => (
                <label
                  key={interest}
                  htmlFor={`interest-${interest.replace(/\s+/g, '-').toLowerCase()}`}
                  className={`interest-chip ${formData.interests.includes(interest) ? 'selected' : ''}`}
                >
                  <input
                    id={`interest-${interest.replace(/\s+/g, '-').toLowerCase()}`}
                    type="checkbox"
                    checked={formData.interests.includes(interest)}
                    onChange={() => toggleInterest(interest)}
                  />
                  {interest}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="auth-btn">Create Account</button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
