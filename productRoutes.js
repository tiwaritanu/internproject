const express = require('express');
const Product = require('../models/product');
const Location = require('../models/Location');
const router = express.Router();

// Changed route to accept shopkeeperId as a URL param
router.get('/:shopkeeperId/products', async (req, res) => {
  const { shopkeeperId } = req.params;

  if (!shopkeeperId) {
    return res.status(400).json({ message: 'shopkeeperId is required' });
  }

  try {
    const products = await Product.find({ shopkeeperId });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/:shopkeeperId/location', async (req, res) => {
  const { shopkeeperId } = req.params;

  if (!shopkeeperId) {
    return res.status(400).json({ message: 'shopkeeperId is required' });
  }

  try {
    const location = await Location.findOne({ shopkeeperId });
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// In your products route file


module.exports = router;  