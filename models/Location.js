const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  shopkeeperId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'sellerapproveds', // Reference to your shopkeeper collection
    required: true 
  },
  address: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  landmark: { type: String },
  contact: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Location', locationSchema);
