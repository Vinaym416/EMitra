const Product = require('../models/Product');

// Get all products from DB
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get a product by ID from DB
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    res.status(404).json({ error: 'Product not found' });
  }
};

// Add a product to DB
exports.addProduct = async (req, res) => {
  const { name, price, imageUrl, sourceUrl, description, category, store } = req.body;
  try {
    const product = new Product({
      name,
      price,
      imageUrl,
      sourceUrl,
      description,
      category,
      store,
    });
    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product' });
  }
};