const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  datePosted: { type: Date, default: Date.now },
  imageUrl: { type: String, required: true },
  sourceUrl: { type: String },
  description: { type: String },
  category: { type: String },
  store: { type: String },
  tags: [{ type: String }],
});

productSchema.index({ datePosted: -1 });

module.exports = mongoose.model('Product', productSchema);