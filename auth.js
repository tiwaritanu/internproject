const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');           // Customers
const Admin = require('../models/Admin');         // Admins
const SellerApproved = require('../models/SellerApproved'); // Approved shopkeepers
const SellerWait = require('../models/SellerWait');         // Waiting shopkeepers

const router = express.Router();

// SIGNUP route
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password, userType, phone, location } = req.body;

    if (!fullName || !email || !password || !userType) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    // Check if email already exists in respective collection
    let existingUser;
    if (userType === 'Customer') {
      existingUser = await User.findOne({ email });
    } else if (userType === 'Admin') {
      existingUser = await Admin.findOne({ email });
    } else if (userType === 'Shopkeeper') {
      // For Shopkeepers, they go into waiting list first
      existingUser = await SellerWait.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Shopkeeper already requested registration. Please wait for approval.' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    if (userType === 'Customer' || userType === 'Admin') {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user/admin
      let newUser;
      if (userType === 'Customer') {
        newUser = new User({
          fullName,
          email,
          password: hashedPassword,
          userType,
          phone,
          location,
        });
      } else if (userType === 'Admin') {
        newUser = new Admin({
          fullName,
          email,
          password: hashedPassword,
          userType,
          phone,
          location,
        });
      }

      await newUser.save();
      return res.status(201).json({ message: `${userType} registered successfully!` });

    } else if (userType === 'Shopkeeper') {
      // For shopkeepers, add to waiting list without hashing (assuming plain text password for now)
      const newShopkeeperRequest = new SellerWait({
        fullName,
        email,
        password, // Plain text - consider hashing later for security!
        phone,
        location,
      });
      await newShopkeeperRequest.save();
      return res.status(201).json({ message: 'Shopkeeper registration request submitted. Please wait for approval.' });
    }
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Server error during signup', error: error.message });
  }
});

// LOGIN route (your existing one with minor fixes)
router.post('/login', async (req, res) => {
  const { email, password, userType } = req.body;
  console.log('Login attempt:', { email, userType });

  try {
    let user;

    if (userType === 'Admin') {
      user = await Admin.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or account type' });
      }
      if (password !== user.password) {
    return res.status(400).json({ message: 'Invalid password' });
  }

    } else if (userType === 'Customer') {
      user = await User.findOne({ email, userType: 'Customer' });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or account type' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
      }

    } else if (userType === 'Shopkeeper') {
      // Check SellerApproved first
      user = await SellerApproved.findOne({ email });
      if (!user) {
        // Check waiting list
        const waitingSeller = await SellerWait.findOne({ email });
        if (waitingSeller) {
          return res.status(403).json({ message: 'Your account is pending approval.' });
        } else {
          return res.status(400).json({ message: 'Invalid email or account type' });
        }
      }
      // Password check for plain text (not hashed for sellers)
      if (password !== user.password) {
        return res.status(400).json({ message: 'Invalid password' });
      }

    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, userType },
      process.env.JWT_SECRET || 'yoursecretkey',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      userType,
      fullName: user.fullName,
      email: user.email,
    });

  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
