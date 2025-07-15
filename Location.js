// routes/Location.js

const express = require('express');
const router = express.Router();
const verifyShopkeeper = require('../middleware/auth');
const Location = require('../models/Location');

// @route   GET /api/location
// @desc    Get current shopkeeper's saved location
// @access  Private (shopkeeper)
router.get('/', verifyShopkeeper, async (req, res) => {
  try {
    const loc = await Location.findOne({ shopkeeperId: req.shopkeeper._id });
    if (!loc) return res.status(404).json({ message: 'No location found' });
    res.json(loc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/location
// @desc    Create or update shopkeeper's location
// @access  Private (shopkeeper)
router.post('/', verifyShopkeeper, async (req, res) => {
  const { address, latitude, longitude, landmark, contact } = req.body;

  try {
    // see if there's an existing location for this shopkeeper
    let loc = await Location.findOne({ shopkeeperId: req.shopkeeper._id });

    if (loc) {
      // update existing
      loc.address   = address;
      loc.latitude  = latitude;
      loc.longitude = longitude;
      loc.landmark  = landmark;
      loc.contact   = contact;
      await loc.save();
      return res.json({ message: 'Location updated', location: loc });
    }

    // create new
    loc = new Location({
      shopkeeperId: req.shopkeeper._id,
      address,
      latitude,
      longitude,
      landmark,
      contact
    });
    await loc.save();
    res.status(201).json({ message: 'Location created', location: loc });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving location' });
  }
});

module.exports = router;
