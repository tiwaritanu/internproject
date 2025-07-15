const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');  // <-- import Admin model here

// POST route for admin signup
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, adminID } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const newAdmin = new Admin({ fullName, email, password, adminID });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
