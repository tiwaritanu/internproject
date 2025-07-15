const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  shopName: String,
  shopCategory: [String],
  shopAddress: String,
  shopPhone: String,
  shopDescription: String,
  businessHours: String,
  userType: { type: String, default: 'shopkeeper' },
  termsAccepted: Boolean,
  uploadedFiles: [String], // Store file paths or URLs
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SellerWait', sellerSchema);
