// Navbar1.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar1.css'; // <-- Import the CSS here

const Navbar1 = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        WhereToPurchase
      </Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/how-it-works">How It Works</Link>
        <Link to="/login" className="navbar-login">Log in</Link>
        <Link to="/signup">
          <button className="navbar-signup-btn">Sign up</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar1;
