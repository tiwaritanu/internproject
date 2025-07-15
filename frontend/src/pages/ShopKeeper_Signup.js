import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ShopKeeper_Signup.css';

const ShopKeeper_SignUp = () => {
  const [activeTab, setActiveTab] = useState('register');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [form1, setForm1] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [form3, setForm3] = useState({
    shopName: '',
    shopCategory: [],
    shopAddress: '',
    shopPhone: '',
    shopDescription: '',
    businessHours: '',
    termsAccepted: false,
  });

  const allCategories = [
    "Grocery", "Electronics", "Clothing", "Home & Garden", "Bakery",
    "Pharmacy", "Books", "Toys", "Beauty", "Stationery", "Sports"
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'login') navigate('/login');
  };

  const handleChange1 = (e) => {
    const { name, value } = e.target;
    setForm1(f => ({ ...f, [name]: value }));
  };

  const handleContinue1 = (e) => {
    e.preventDefault();
    if (form1.password !== form1.confirmPassword) {
      return alert('Passwords do not match!');
    }
    setStep(2);
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(files);
  };

  const handleContinue2 = (e) => {
    e.preventDefault();
    if (uploadedFiles.length === 0) {
      return alert('Please upload at least one document.');
    }
    setStep(3);
  };

  const handleChange3 = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'shopCategory') {
      let updatedCategories = [...form3.shopCategory];
      if (checked) {
        updatedCategories.push(value);
      } else {
        updatedCategories = updatedCategories.filter(cat => cat !== value);
      }
      setForm3(f => ({ ...f, shopCategory: updatedCategories }));
    } else {
      setForm3(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleCreateShop = async (e) => {
    e.preventDefault();
    if (!form3.termsAccepted) {
      return alert('Please accept the Terms of Service and Privacy Policy.');
    }

    const formData = new FormData();
    formData.append('fullName', form1.fullName);
    formData.append('email', form1.email);
    formData.append('password', form1.password);

    formData.append('shopName', form3.shopName);
    formData.append('shopCategory', JSON.stringify(form3.shopCategory));
    formData.append('shopAddress', form3.shopAddress);
    formData.append('shopPhone', form3.shopPhone);
    formData.append('shopDescription', form3.shopDescription);
    formData.append('businessHours', form3.businessHours);

    formData.append('document', uploadedFiles[0]);

  

    try {
      const res = await axios.post('http://localhost:5000/api/seller/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.status === 201 || res.data.success) {
        alert('Registration successful. Awaiting approval.');
        navigate('/welcome');
      } else {
        alert('Something went wrong while registering. Please try again later.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong while registering. Please try again later.');
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
          <form className="signup-form" onSubmit={handleContinue1}>
            <h3 className="iam-title">I am a:</h3>
            <div className="user-type-selection">
              <button type="button" className="user-type inactive">
                <span className="icon">👤</span> Customer
              </button>
              <button type="button" className="user-type active">
                <span className="icon">🏪</span> Shopkeeper
              </button>
            </div>

            <label>Full Name</label>
            <input type="text" name="fullName" required value={form1.fullName} onChange={handleChange1} placeholder="Enter your full name" />

            <label>Email Address</label>
            <input type="email" name="email" required value={form1.email} onChange={handleChange1} placeholder="Enter your email" />

            <label>Password</label>
            <input type="password" name="password" required value={form1.password} onChange={handleChange1} placeholder="Create a strong password" />
            <small>Must be at least 8 characters with a mix of letters, numbers, and symbols.</small>

            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" required value={form1.confirmPassword} onChange={handleChange1} placeholder="Re-enter your password" />

            <button className="continue-btn" type="submit">Continue →</button>
            <p className="login-link">Already have an account? <a href="/login">Log In</a></p>
          </form>
        )}

        {step === 2 && (
          <form className="signup-form" onSubmit={handleContinue2}>
            <label className="upload-label">Upload Verification Documents</label>
            <p className="upload-help">Please upload business registration, tax documents, or other proof of your business.</p>

            <div className="upload-box">
              <span className="upload-icon">⬆️</span>
              <p>Drag & drop files or <label htmlFor="fileInput" className="browse">browse</label></p>
              <p className="small">Supported formats: PDF, JPG, PNG (Max 5MB each)</p>
              <input id="fileInput" type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFiles} />
            </div>

            {uploadedFiles.length > 0 && (
              <div className="file-list">
                <h4>Selected Documents:</h4>
                <ul>
                  {uploadedFiles.map((file, i) => (
                    <li key={i}>
                      <strong>{file.name}</strong>
                      <div className="file-preview">
                        {file.type.includes('image') ? (
                          <img src={URL.createObjectURL(file)} alt={file.name} style={{ width: '100px', marginTop: '5px' }} />
                        ) : file.type === 'application/pdf' ? (
                          <iframe src={URL.createObjectURL(file)} title={`pdf-${i}`} width="100%" height="200px" style={{ border: '1px solid #ccc', marginTop: '5px' }}></iframe>
                        ) : (
                          <span>Unsupported preview</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="alert">Your account will be pending approval until we verify your documents. This usually takes 1–2 business days.</div>
            <button className="continue-btn" type="submit">Continue →</button>
            <p className="login-link">Already have an account? <a href="/login">Log In</a></p>
          </form>
        )}

        {step === 3 && (
          <form className="signup-form" onSubmit={handleCreateShop}>
            <h3>Shop Information</h3>

            <label>Shop Name</label>
            <input type="text" name="shopName" required value={form3.shopName} onChange={handleChange3} placeholder="Enter your shop name" />

            <label>Shop Category (Select one or more)</label>
            <div className="checkbox-list">
              {allCategories.map((category, index) => (
                <label key={index} className="checkbox-item">
                  <input
                    type="checkbox"
                    name="shopCategory"
                    value={category}
                    checked={form3.shopCategory.includes(category)}
                    onChange={handleChange3}
                  />
                  {category}
                </label>
              ))}
            </div>

            <label>Shop Address</label>
            <input type="text" name="shopAddress" required value={form3.shopAddress} onChange={handleChange3} placeholder="Enter your shop's full address" />

            <label>Shop Phone Number</label>
            <input type="text" name="shopPhone" required value={form3.shopPhone} onChange={handleChange3} placeholder="Enter shop phone number" />

            <label>Shop Description</label>
            <textarea name="shopDescription" required rows="4" value={form3.shopDescription} onChange={handleChange3} placeholder="Briefly describe your shop and what you sell" />

            <label>Business Hours</label>
            <input type="text" name="businessHours" required value={form3.businessHours} onChange={handleChange3} placeholder="e.g., Mon–Fri: 9AM–5PM, Sat: 10AM–3PM" />

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={form3.termsAccepted}
                  onChange={handleChange3}
                />
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </label>
            </div>

            <button className="continue-btn" type="submit">Submit Registration</button>
            <p className="login-link">Already have an account? <a href="/login">Log In</a></p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ShopKeeper_SignUp;
