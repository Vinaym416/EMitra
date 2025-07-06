const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const products = await Product.find({})
      .sort({ datePosted: -1 }) 
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments();

    res.status(200).json({
      products,
      total,
      hasMore: skip + limit < total
    });
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
      tags,
    });
    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product' });
  }
};

exports.deleteAllProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    res.status(200).json({ message: "All products deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete products" });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json({ message: 'Product updated', product });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};