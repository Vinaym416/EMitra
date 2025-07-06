const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String }, // optional, for frontend display
    }
  ],
  total: { type: Number, required: true },
  status: { type: String, enum: ["Processing", "Shipped", "Delivered", "Cancelled"], default: "Processing" },
  orderedAt: { type: Date, default: Date.now },
  deliveredAt: { type: Date },
  location: {
    latitude: { type: Number },
    longitude: { type: Number }
  }
});

module.exports = mongoose.model('Order', orderSchema);
