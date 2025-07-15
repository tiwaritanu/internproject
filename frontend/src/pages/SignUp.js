import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const [userType, setUserType] = useState('Customer');
  const [activeTab, setActiveTab] = useState('register');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
    termsAccepted: false,
    receiveUpdates: false,
  });

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'login') {
      navigate('/login');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    setStep(2);
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      alert('Please accept the Terms of Service and Privacy Policy.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          userType: userType,
          phone: formData.phone,
          location: formData.location,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Signup successful!');
        navigate('/welcome');
      } else {
        alert(data.message || 'Signup failed!');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed due to server error.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => handleTabClick('register')}
          >
            Register
          </button>
          <button
            className={`tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => handleTabClick('login')}
          >
            Login
          </button>
        </div>

        {step === 1 && (
          <>
            <h3 className="iam-title">I am a:</h3>
            <div className="user-type-selection extended">
              <button
                className={userType === 'Customer' ? 'user-type active' : 'user-type'}
                onClick={() => setUserType('Customer')}
              >
                <span className="icon">👤</span>
                Customer
              </button>
              <button
                className={userType === 'Shopkeeper' ? 'user-type active' : 'user-type'}
                onClick={() => {
                  setUserType('Shopkeeper');
                  navigate('/shopkeeper-signup');
                }}
              >
                <span className="icon">🏪</span>
                Shopkeeper
              </button>
              <button
                className={userType === 'Admin' ? 'user-type active' : 'user-type'}
                onClick={() => {
                  setUserType('Admin');
                  navigate('/admin-signup');
                }}
              >
                <span className="icon">🛡️</span>
                Admin
              </button>
            </div>

            <form className="signup-form" onSubmit={handleContinue}>
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />

              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />

              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
              />
              <small>
                Must be at least 8 characters with a mix of letters, numbers, and symbols.
              </small>

              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
              />

              <button className="continue-btn" type="submit">
                Continue →
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <form className="signup-form" onSubmit={handleCreateAccount}>
            <h3>Additional Information</h3>

            <label>Phone Number (Optional)</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />

            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter your city and state"
            />

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  required
                />
                I agree to the <a href="#">Terms of Service</a> and{' '}
                <a href="#">Privacy Policy</a>
              </label>
            </div>

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="receiveUpdates"
                  checked={formData.receiveUpdates}
                  onChange={handleChange}
                />
                Send me updates about products near me and special offers (optional)
              </label>
            </div>

            <div className="button-group">
              <button type="button" className="back-btn" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="create-btn" type="submit">
                Create Account
              </button>
            </div>
          </form>
        )}

        {step === 1 && (
          <p className="login-link">
            Already have an account? <a href="/login">Log In</a>
          </p>
        )}
      </div>
    </div>
  );
};

export default SignUp;
