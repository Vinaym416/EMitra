const axios = require('axios');

// Using external fake store API to simulate dropshipping
exports.getAllProducts = async (req, res) => {
  try {
    const response = await axios.get('https://fakestoreapi.com/products');
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products from supplier' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
    res.status(200).json(response.data);
  } catch (err) {
    res.status(404).json({ error: 'Product not found' });
  }
};

// Optional: Add product to your own DB
exports.addProduct = async (req, rxxxzes) => {
  const { title, price, description, image, category } = req.body;

  try {
    // Save to DB if needed. For now, simulate success
    res.status(201).json({ message: 'Product added successfully', product: req.body });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product' });
  }
};
