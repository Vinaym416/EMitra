const Order = require("../models/orders.js");


exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).sort({ orderedAt: -1 });
    const formatted = orders.map(order => ({
      id: order._id,
      date: order.orderedAt,
      status: order.status,
      total: order.total,
      items: order.items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      deliveredAt: order.deliveredAt,
      location: order.location,
    }));
    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};


exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, total, status, location } = req.body;
    const order = new Order({
      userId,
      items,
      total,
      status: status || "Processing",
      location,
    });
    await order.save();
    res.status(201).json({ message: "Order created", orderId: order._id });
  } catch (err) {
    res.status(500).json({ error: "Failed to create order" });
  }
};



exports.getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await Order.findOne({ _id: req.params.id, userId });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
};



exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, deliveredAt } = req.body;
    const update = { status };
    if (status === "Delivered" && deliveredAt) update.deliveredAt = deliveredAt;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(200).json({ message: "Order updated", order });
  } catch (err) {
    res.status(500).json({ error: "Failed to update order" });
  }
};



exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(200).json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete order" });
  }
};