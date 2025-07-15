const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Create a new product
router.post('/', async (req, res) => {
  try {
    const { name, price, category, stockQuantity, image, description, available } = req.body;

    const token = req.headers.authorization?.split(' ')[1];
    // You must decode token to get shopkeeperId or pass it from frontend directly (safer)

    // Example: if you're storing shopkeeperId in token, decode it here using JWT
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // replace with your actual secret
    const shopkeeperId = decoded.id;  // assuming the token contains 'id'

    const newProduct = new Product({
      name,
      price,
      category,
      stockQuantity,
      image,
      description,
      available,
      shopkeeperId  // link product to the shopkeeper
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Failed to add product:', err);
    res.status(500).json({ message: 'Failed to add product', error: err.message });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json(updatedProduct);
  } catch (err) {
    console.error('Update failed:', err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});


// Search products with shopname and location
router.get('/search/all', async (req, res) => {
  const searchQuery = req.query.search || '';

  try {
    const regex = new RegExp(searchQuery, 'i');

    const products = await Product.aggregate([
      {
        $match: {
          $or: [
            { name: regex },
            { description: regex }
          ]
        }
      },
      {
        $lookup: {
          from: 'sellerapproveds',        // join sellerapproveds collection
          localField: 'shopkeeperId',     // product.shopkeeperId (ObjectId)
          foreignField: '_id',            // sellerapproveds._id (ObjectId)
          as: 'shopkeeperData'
        }
      },
      {
        $unwind: { path: '$shopkeeperData', preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: 'locations',
          let: { shopIdObj: '$shopkeeperId' },  // product.shopkeeperId (ObjectId)
          pipeline: [
            {
              $match: {
                $expr: {
                  // Convert location.shopkeeperId string to ObjectId and compare
                  $eq: [
                    { $toObjectId: '$shopkeeperId' }, 
                    '$$shopIdObj'
                  ]
                }
              }
            }
          ],
          as: 'locationData'
        }
      },
      {
        $unwind: { path: '$locationData', preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          name: 1,
          description: 1,
          price: 1,
          stockQuantity: 1,
          image: 1,
          available: 1,
          shopname: { $ifNull: ['$shopkeeperData.shopName', 'N/A'] },
          location: { $ifNull: ['$locationData', {}] }  // full location document or empty object
        }
      }
    ]);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

// Get products belonging to the logged-in shopkeeper
router.get('/myproducts', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const shopkeeperId = decoded.id;

    const products = await Product.find({ shopkeeperId });
    res.json(products);
  } catch (err) {
    console.error('Failed to fetch shopkeeper products:', err);
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
});

module.exports = router;
