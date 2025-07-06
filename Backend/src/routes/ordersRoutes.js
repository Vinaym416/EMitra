const express = require("express");
const router = express.Router();
const {
  getUserOrders,
  createOrder,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} = require("../controllers/ordersController.js");
const auth = require("../middleware/authMiddleware.js");


router.get("/", auth, getUserOrders);

router.post("/", auth, createOrder);

router.get("/:id", auth, getOrderById);

router.patch("/:id", auth, updateOrderStatus);

router.delete("/:id", auth, deleteOrder);

module.exports = router;