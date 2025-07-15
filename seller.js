const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const SellerWait = require('../models/SellerWait');
const SellerApproved = require('../models/SellerApproved');

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up file upload (single file)

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// POST /api/seller/register - seller registration (single document)
router.post('/register', upload.single('document'), async (req, res) => {
  try {
    console.log('req.file:', req.file);
    const {
      fullName, email, password,
      shopName, shopCategory, shopAddress, shopPhone,
      shopDescription, businessHours, termsAccepted
    } = req.body;

    // File path (if uploaded)
    const filePath = req.file ? req.file.path : null;

    const newSeller = new SellerWait({
      fullName,
      email,
      password,
      shopName,
      // parse if shopCategory is sent as stringified JSON
      shopCategory: typeof shopCategory === 'string' ? JSON.parse(shopCategory) : shopCategory,
      shopAddress,
      shopPhone,
      shopDescription,
      businessHours,
      termsAccepted,
      uploadedFiles: filePath ? [filePath] : []
    });

    await newSeller.save();
    res.status(201).json({ message: 'Shopkeeper submitted for approval.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/seller/waiting - fetch all pending sellers
router.get('/waiting', async (req, res) => {
  try {
    const sellers = await SellerWait.find();
    res.json(sellers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Accept a seller: move from SellerWait to SellerApproved
router.post('/accept/:id', async (req, res) => {
  try {
    const seller = await SellerWait.findById(req.params.id);
    if (!seller) return res.status(404).json({ error: 'Seller not found' });

    const approvedSeller = new SellerApproved(seller.toObject());
    await approvedSeller.save();
    await SellerWait.findByIdAndDelete(req.params.id);

    res.json({ message: 'Seller approved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Decline a seller: delete from SellerWait
router.delete('/decline/:id', async (req, res) => {
  try {
    const seller = await SellerWait.findByIdAndDelete(req.params.id);
    if (!seller) return res.status(404).json({ error: 'Seller not found' });

    res.json({ message: 'Seller declined and removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
