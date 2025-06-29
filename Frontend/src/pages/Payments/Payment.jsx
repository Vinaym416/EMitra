import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/button';
import Header from "../../components/ui/Header";
import BottomNav from "../../components/ui/ButtomNav";

export default function PaymentPage() {
  const navigate = useNavigate();
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const shippingCost = 50;
  const taxes = 100;
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalAmount = subtotal + shippingCost + taxes;
  const amountInPaise = totalAmount * 100;

  React.useEffect(() => {
    // Listen for browser back button
    const handlePopState = (e) => {
      e.preventDefault();
      navigate('/checkout', { replace: true });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  const handlePayment = async () => {
    const res = await loadRazorpay();
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY || 'rzp_test_1234567890',
      amount: amountInPaise.toString(),
      currency: 'INR',
      name: 'My Store',
      description: 'Order Payment',
      handler: function (response) {
        console.log('Payment Success:', response);
        navigate('/payment-success');
      },
      prefill: {
        name: 'Test User',
        email: 'test@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#3399cc'
      },
      config: {
        display: {
          blocks: {
            banks: {
              name: "Pay via Bank or UPI",
              instruments: [
                { method: "upi" },
                { method: "netbanking" },
                { method: "card" },
                { method: "wallet" }
              ]
            }
          },
          sequence: ["block.banks"],
          preferences: { show_default_blocks: true }
        }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 py-10 px-4 pt-16 pb-16">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-center">Payment</h2>
          {/* Order Summary (inlined here) */}
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h3 className="text-xl font-semibold">Order Summary</h3>
            <ul className="divide-y">
              {cartItems.map(item => (
                <li key={item.id} className="py-2 flex justify-between text-sm">
                  <span>
                    {item.name}
                    <span className="text-xs text-gray-400"> x{item.quantity}</span>
                  </span>
                  <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between pt-4 text-sm">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>₹{shippingCost}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Taxes</span>
              <span>₹{taxes}</span>
            </div>
            <div className="flex justify-between border-t pt-3 text-base font-bold">
              <span>Total</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md"
            onClick={handlePayment}
          >
            Pay ₹{totalAmount.toLocaleString()}
          </Button>
          <Button
            className="w-full bg-gray-200 text-gray-800 py-2 rounded mt-2"
            type="button"
            onClick={() => navigate('/checkout')}
          >
            Back
          </Button>
        </div>
      </div>
      <BottomNav />
    </>
  );
}