import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/button';

// Helper to get cart from localStorage
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

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const renderStep = () => {
    switch (step) {
      case 1: return <ShippingForm onNext={() => setStep(2)} />;
      case 2: return <DeliveryMethod onNext={() => setStep(3)} />;
      case 3: return <BillingForm onNext={() => setStep(4)} />;
      case 4: return <PaymentForm onNext={() => setStep(5)} />;
      case 5: return <OrderConfirmation />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>{renderStep()}</div>
        <div>
          <OrderSummary
            cartItems={cartItems}
            shippingCost={shippingCost}
            taxes={taxes}
          />
        </div>
      </div>
    </div>
  );
}

function ShippingForm({ onNext }) {
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
    </form>
  );
}

function DeliveryMethod({ onNext }) {
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
    </div>
  );
}

function BillingForm({ onNext }) {
  return (
    <form className="bg-white p-6 rounded-lg shadow-md space-y-4" onSubmit={e => { e.preventDefault(); onNext(); }}>
      <h3 className="text-xl font-semibold">Billing Details</h3>
      <input className="w-full p-2 border rounded" placeholder="Cardholder Name" required />
      <input className="w-full p-2 border rounded" placeholder="Billing Address (optional)" />
      <Button className="w-full bg-blue-600 text-white py-2 rounded" type="submit">
        Continue to Payment
      </Button>
    </form>
  );
}

function PaymentForm({ onNext }) {
  return (
    <form className="bg-white p-6 rounded-lg shadow-md space-y-4" onSubmit={e => { e.preventDefault(); onNext(); }}>
      <h3 className="text-xl font-semibold">Payment</h3>
      <input className="w-full p-2 border rounded" placeholder="Card Number" required />
      <div className="flex gap-2">
        <input className="w-1/2 p-2 border rounded" placeholder="MM/YY" required />
        <input className="w-1/2 p-2 border rounded" placeholder="CVV" required />
      </div>
      <Button className="w-full bg-blue-600 text-white py-2 rounded" type="submit">
        Pay Now
      </Button>
    </form>
  );
}

function OrderConfirmation() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4 text-center">
      <h3 className="text-2xl font-semibold text-green-600">✅ Payment Successful!</h3>
      <p>Your order has been placed. Thank you!</p>
      <Button className="mt-4 bg-green-600 text-white py-2 rounded" onClick={() => window.location.href = '/'}>
        Back to Home
      </Button>
    </div>
  );
}

function OrderSummary({ cartItems, shippingCost, taxes }) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
      <ul className="divide-y">
        {cartItems.length === 0 ? (
          <li className="py-2 text-gray-500">Your cart is empty.</li>
        ) : (
          cartItems.map(item => (
            <li key={item.id} className="py-2 flex justify-between items-center">
              <span>
                {item.name} <span className="text-xs text-gray-400">x{item.quantity}</span>
              </span>
              <span>₹{item.price * item.quantity}</span>
            </li>
          ))
        )}
      </ul>
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>₹{subtotal}</span>
      </div>
      <div className="flex justify-between">
        <span>Shipping</span>
        <span>₹{shippingCost}</span>
      </div>
      <div className="flex justify-between">
        <span>Taxes</span>
        <span>₹{taxes}</span>
      </div>
      <div className="flex justify-between font-bold border-t pt-2">
        <span>Total</span>
        <span>₹{subtotal + shippingCost + taxes}</span>
      </div>
    </div>
  );
}