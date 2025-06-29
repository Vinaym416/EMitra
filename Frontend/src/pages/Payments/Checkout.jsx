import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/button';
import Header from "../../components/ui/Header";
import BottomNav from "../../components/ui/ButtomNav";
import { useNavigate } from "react-router-dom";

// Retrieve cart from localStorage
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cartItems")) || [];
  } catch {
    return [];
  }
}

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const shippingCost = 50;
  const taxes = 100;
  const navigate = useNavigate();

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const renderStep = () => {
    switch (step) {
      case 1: return <ShippingForm onNext={() => setStep(2)} onAddMore={() => navigate("/products")} />;
      case 2: return <DeliveryMethod onNext={() => setStep(3)} onAddMore={() => navigate("/products")} />;
      case 3: return <BillingForm onNext={() => setStep(4)} onAddMore={() => navigate("/products")} />;
      case 4: return (
        <PaymentForm
          cartItems={cartItems}
          shippingCost={shippingCost}
          taxes={taxes}
          onSuccess={() => setStep(5)}
          onAddMore={() => navigate("/products")}
        />
      );
      case 5: return <OrderConfirmation />;
      default: return null;
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-10 px-4 pt-16 pb-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>{renderStep()}</div>
          <div>
            <OrderSummary cartItems={cartItems} shippingCost={shippingCost} taxes={taxes} />
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}

//  Shipping Info
function ShippingForm({ onNext, onAddMore }) {
  return (
    <form className="bg-white p-6 rounded-lg shadow-md space-y-4" onSubmit={e => { e.preventDefault(); onNext(); }}>
      <h3 className="text-xl font-semibold">Shipping Address</h3>
      <input className="w-full p-2 border rounded" placeholder="Full Name" required />
      <input className="w-full p-2 border rounded" placeholder="Address Line 1" required />
      <input className="w-full p-2 border rounded" placeholder="City, State, ZIP" required />
      <input className="w-full p-2 border rounded" placeholder="Phone Number" required />
      <Button className="w-full bg-blue-600 text-white py-2 rounded" type="submit">
        Continue to Delivery
      </Button>
      <Button
        className="w-full bg-gray-200 text-gray-800 py-2 rounded mt-2"
        type="button"
        onClick={onAddMore}
      >
        Add More Items
      </Button>
    </form>
  );
}

//  Delivery Method
function DeliveryMethod({ onNext, onAddMore }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h3 className="text-xl font-semibold">Choose Delivery Method</h3>
      <div className="space-y-2">
        <label className="flex items-center">
          <input type="radio" name="delivery" className="mr-2" defaultChecked />
          Standard (₹50, 3–5 days)
        </label>
        <label className="flex items-center">
          <input type="radio" name="delivery" className="mr-2" />
          Express (₹150, 1–2 days)
        </label>
      </div>
      <Button className="w-full bg-blue-600 text-white py-2 rounded" onClick={onNext}>
        Continue to Billing
      </Button>
      <Button
        className="w-full bg-gray-200 text-gray-800 py-2 rounded mt-2"
        type="button"
        onClick={onAddMore}
      >
        Add More Items
      </Button>
    </div>
  );
}

//  Billing Info
function BillingForm({ onNext, onAddMore }) {
  return (
    <form className="bg-white p-6 rounded-lg shadow-md space-y-4" onSubmit={e => { e.preventDefault(); onNext(); }}>
      <h3 className="text-xl font-semibold">Billing Details</h3>
      <input className="w-full p-2 border rounded" placeholder="Cardholder Name" required />
      <input className="w-full p-2 border rounded" placeholder="Billing Address (optional)" />
      <Button className="w-full bg-blue-600 text-white py-2 rounded" type="submit">
        Continue to Payment
      </Button>
      <Button
        className="w-full bg-gray-200 text-gray-800 py-2 rounded mt-2"
        type="button"
        onClick={onAddMore}
      >
        Add More Items
      </Button>
    </form>
  );
}

//  Razorpay Integration
function PaymentForm({ cartItems, shippingCost, taxes, onSuccess, onAddMore }) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalAmount = subtotal + shippingCost + taxes;

  const loadRazorpayScript = () => {
    return new Promise(resolve => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) return alert("Razorpay SDK failed to load.");

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_1234567890", 
      amount: totalAmount * 100,
      currency: "INR",
      name: "My Shop",
      description: "Order Payment",
      handler: function (response) {
        console.log("Payment successful:", response);
        onSuccess();
      },
      prefill: {
        name: "John Doe",
        email: "johndoe@example.com",
        contact: "9999999999"
      },
      theme: {
        color: "#3399cc"
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h3 className="text-xl font-semibold">Payment</h3>
      <p className="text-gray-600">You'll be redirected to Razorpay to complete the payment.</p>
      <Button
        className="w-full bg-green-600 text-white py-2 rounded"
        onClick={handleRazorpayPayment}
      >
        Pay ₹{totalAmount.toLocaleString()}
      </Button>
      <Button
        className="w-full bg-gray-200 text-gray-800 py-2 rounded mt-2"
        type="button"
        onClick={onAddMore}
      >
        Add More Items
      </Button>
    </div>
  );
}

// Step 5: Order Confirmation
function OrderConfirmation() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center space-y-4">
      <h3 className="text-2xl font-semibold text-green-600">✅ Payment Successful!</h3>
      <p>Your order has been placed. Thank you for shopping with us!</p>
      <Button
        className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded"
        onClick={() => window.location.href = '/'}
      >
        Back to Home
      </Button>
    </div>
  );
}

// Order Summary Component (Right Column)
function OrderSummary({ cartItems, shippingCost, taxes }) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + shippingCost + taxes;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h3 className="text-xl font-semibold mb-2">Order Summary</h3>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-sm">No items in cart.</p>
      ) : (
        <ul className="divide-y">
          {cartItems.map(item => (
            <li key={item.id} className="py-2 flex justify-between text-sm">
              <span>{item.name} <span className="text-xs text-gray-400">x{item.quantity}</span></span>
              <span>₹{(item.price * item.quantity).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}

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
      <div className="flex justify-between font-bold border-t pt-3 text-base">
        <span>Total</span>
        <span>₹{total.toLocaleString()}</span>
      </div>
    </div>
  );
}