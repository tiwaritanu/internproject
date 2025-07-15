const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stockQuantity: { type: Number, required: true },
  image: { type: String },
  description: { type: String },
  available: { type: Boolean, default: false },
  shopkeeperId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'sellerapproveds', // updated reference name to your collection
    required: true 
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
