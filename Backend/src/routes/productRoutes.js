const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');

// Get all products
router.get('/', ProductController.getAllProducts);

// Get product by ID
router.get('/:id', ProductController.getProductById);

// Add a product (no auth)
router.post('/add', ProductController.addProduct);

module.exports = router;