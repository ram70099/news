import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Header.css';

const Header = ({ search, handleSearchChange, handleSearchSubmit }) => {


  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage on initial load
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/';  // Redirect user to home page after logout
  };

  return (
    <nav className="header-nav">
      <div className="logo-container">
        <h1>Trendy News</h1>
      </div>
      
      <ul className="nav-links">
        <li><Link to={`/`} className="nav-link">All News</Link></li>
        <li><Link to={`/`} className="nav-link">Trending</Link></li>
      </ul>
      
      <div className="searchBar">
        <input
          type="text"
          placeholder="Search News"
          value={search}
          onChange={handleSearchChange}
        />
        <button onClick={handleSearchSubmit} className="search-btn">Search</button>
      </div>
      
      <div className="auth-container">
      <div className="auth-options">
          {isLoggedIn ? (
            // Show Log Out if the user is logged in
            <button className="auth-btn" onClick={handleLogout}>Log Out</button>
          ) : (
            // Show Sign In and Sign Up if the user is not logged in
            <>
              <Link to="/signin" className="auth-btn">Sign In</Link>
              <Link to="/signup" className="auth-btn">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
