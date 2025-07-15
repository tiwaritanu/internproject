const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log('Uploads folder created.');
}

// 2. Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// ✅ 3. Expose uploads folder to frontend
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB connection error:', err));

// 5. Routes
const sellerRoutes = require('./routes/seller');
app.use('/api/seller', sellerRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const productRoutes = require('./routes/Product');
app.use('/api/products', productRoutes);

const locationRoutes = require('./routes/Location');
app.use('/api/location', locationRoutes);

const shopRoutes = require('./routes/shopRoutes');
app.use('/api/shops', shopRoutes);

const shopProductRoutes = require('./routes/productRoutes');
app.use('/api/productshops', shopProductRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
