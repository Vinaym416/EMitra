const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');

// Route to get all products
router.get('/', CartController.getAllProducts);

// Route to get a product by ID
router.get('/:id', CartController.getProductById);

// Route to add a product (optional, as per your controller)
router.post('/', CartController.addProduct);

module.exports = router;