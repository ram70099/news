import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';  // Import axios to make API requests
import styles from '../css/Auth.module.css';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleUsernameChange = (e) => setUsername(e.target.value);

  const handleSignInSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!email || !password || !username) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Sending a POST request to the backend API
      const response = await axios.post('http://localhost:5000/register', {
        email,
        username,
        password,
      });
      if (response.data.success) {
        // Registration successful
        console.log("Registration successful");
        
        // Optionally, you can save the JWT token in localStorage or context (if returned by backend)
        localStorage.setItem('token', response.data.token);

        // Redirect to login page (or sign-in page)
        window.location.href = "/signin";
      }

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
        <h2 className={styles['modal-title']}>Sign Up</h2> {/* Changed to "Sign Up" */}
        <form onSubmit={handleSignInSubmit} className={styles['auth-form']}>
          <div className={styles['form-group']}>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter your name"
              className={styles['input-field']}
            />
          </div>
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
            {loading ? "Signing Up..." : "Sign Up"} {/* Updated button text */}
          </button>
        </form>
        <div className={styles['signup-link']}>
          <p>Already have an account? <Link to="/signin">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
