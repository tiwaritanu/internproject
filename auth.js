// middleware/auth.js
const jwt = require('jsonwebtoken');
const Shopkeeper = require('../models/SellerApproved');

const verifyShopkeeper = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const shopkeeper = await Shopkeeper.findById(decoded.id);
    if (!shopkeeper) return res.status(401).json({ message: 'Invalid token' });

    req.shopkeeper = shopkeeper; // attach shopkeeper to request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = verifyShopkeeper;
