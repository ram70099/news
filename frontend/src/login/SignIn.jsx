import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';  // Import axios to make API calls
import styles from '../css/Auth.module.css';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Sending a POST request to the backend API
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
      });

      // Handle success (e.g., save JWT token, redirect, etc.)
      console.log(response.data);
      // You can save the token or redirect user based on the response
      localStorage.setItem('token', true);
      // Redirect user to homepage/dashboard
      window.location.href = "/";
    } catch (err) {
      // Handle error response
      if (err.response) {
        setError(err.response.data.error || "An error occurred. Please try again.");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['auth-container']}>
      <div className={styles['auth-modal']}>
        <h2 className={styles['modal-title']}>Sign In</h2>
        <form onSubmit={handleSignInSubmit} className={styles['auth-form']}>
          <div className={styles['form-group']}>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className={styles['input-field']}
            />
          </div>
          <div className={styles['form-group']}>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              className={styles['input-field']}
            />
          </div>
          
          {error && <p className={styles['error-message']}>{error}</p>}
          <button type="submit" className={styles['submit-btn']} disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <div className={styles['signup-link']}>
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
