// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['Customer', 'Shopkeeper'], required: true },
  phone: { type: String },
  location: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
