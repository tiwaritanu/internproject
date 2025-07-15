// src/components/Sidebar.js
import React from 'react';
import { FiBox, FiMapPin, FiMessageCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <nav className="sidebar">
      <ul>
        <li className="active">
          <FiBox /> Products
        </li>
        <li onClick={() => navigate('/location')} style={{ cursor: 'pointer' }}>
          <FiMapPin /> Location
        </li>
        <li>
          <FiMessageCircle /> Chat
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;

