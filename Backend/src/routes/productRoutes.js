const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');

// Get all products
router.get('/', ProductController.getAllProducts);

// Get product by ID
router.get('/:id', ProductController.getProductById);

router.put('/:id', ProductController.updateProduct);

// Add a product (no auth)
router.post('/add', ProductController.addProduct);

router.delete('/all', ProductController.deleteAllProducts);

module.exports = router;