import React, { useState } from 'react';
import axios from 'axios';
import './admin.css';

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminID: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/admin/register', formData);
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="register-container">
      <div className="form-box">
        <div className="form-header">
          <button className="tab active">Register</button>
          <button className="tab">Login</button>
        </div>
        <form onSubmit={handleSubmit}>
          <h4>I am a:</h4>
          <div className="role-selector">
            <div className="role inactive">
              <span className="icon">👤</span>
              <span>Customer</span>
            </div>
            <div className="role inactive">
              <span className="icon">🏪</span>
              <span>Shopkeeper</span>
            </div>
            <div className="role active-role">
              <span className="icon">🛡️</span>
              <span>Admin</span>
            </div>
          </div>

          <input
            type="text"
            name="adminID"
            placeholder="Enter your Admin ID"
            value={formData.adminID}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <p className="password-note">
            Must be at least 8 characters with a mix of letters, numbers, and symbols.
          </p>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit" className="submit-button">Create Account</button>
        </form>
        <p className="login-link">Already have an account? <a href="/login">Log In</a></p>
      </div>
    </div>
  );
};

export default AdminSignup;
