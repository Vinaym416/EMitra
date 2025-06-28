const express = require('express');
const PaymentController = require('../controllers/paymentController');

const router = express.Router();
const paymentController = new PaymentController();

// Route to create a new payment
router.post('/payments', paymentController.createPayment);

// Route to confirm a payment
router.post('/payments/confirm', paymentController.confirmPayment);

// Route to get payment details
router.get('/payments/:id', paymentController.getPaymentDetails);

// Route to list all payments
// router.get('/payments', paymentController.listPayments);

module.exports = router;