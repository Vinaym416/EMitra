const express = require('express');
const router = express.Router();
const CatalogController = require('../controllers/catalogController');

const catalogController = new CatalogController();

// Route to create a new catalog item
router.post('/', catalogController.createCatalogItem);

// Route to get all catalog items
// router.get('/', catalogController.getAllCatalogItems);

// // Route to get a specific catalog item by ID
// router.get('/:id', catalogController.getCatalogItemById);

// Route to update a catalog item by ID
router.put('/:id', catalogController.updateCatalogItem);

// Route to delete a catalog item by ID
router.delete('/:id', catalogController.deleteCatalogItem);

module.exports = router;