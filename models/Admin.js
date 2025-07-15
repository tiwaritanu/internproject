const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  adminID: String,
});

// Use existing model if exists, else create
const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

module.exports = Admin;
