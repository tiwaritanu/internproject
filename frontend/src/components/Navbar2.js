// src/components/Navbar2.js
import React from 'react';
import './Navabar2.css';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';

const Navbar2 = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        WhereToPurchase
      </Link>
      <div className="navbar__links">
        <Link to="/find-products">Find Products</Link>
        <Link to="/shops">Shops</Link>
        <Link to="/how-it-works">How It Works</Link>
      
        <span className="navbar__user">
          <FaUser className="user-icon" />
          Customer
        </span>
        <button className="logout-btn">
          <FiLogOut className="logout-icon" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar2;
