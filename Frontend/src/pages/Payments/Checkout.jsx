import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/button';
import Header from "../../components/ui/Header";
import BottomNav from "../../components/ui/ButtomNav";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

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
  const [shippingFields, setShippingFields] = useState({
    fullName: "",
    address: "",
    cityStateZip: "",
    phone: ""
  });
  const [cartItems, setCartItems] = useState([]);
  const [shippingCost, setShippingCost] = useState(50); // Default to standard
  const taxes = 100;
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser } = useAuth();

  useEffect(() => {
    // Check if this is a Buy Now flow
    const params = new URLSearchParams(location.search);
    if (params.get("buynow") === "1") {
      const buyNowProduct = JSON.parse(sessionStorage.getItem("buyNowProduct"));
      if (buyNowProduct) {
        setCartItems([
          {
            id: buyNowProduct._id || buyNowProduct.id,
            name: buyNowProduct.name,
            price: buyNowProduct.price,
            quantity: 1,
            category: buyNowProduct.category,
            image: buyNowProduct.imageUrl,
          },
        ]);
        return;
      }
    }
    setCartItems(getCart());
  }, [location.search]);

  // If user has saved addresses, use them
  const savedAddresses = Array.isArray(authUser?.addresses) ? authUser.addresses : authUser?.address ? [authUser.address] : [];

  // Add state for selected address index
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(savedAddresses.length > 0 ? 0 : null);

  // If a saved address is selected, use it for shippingFields
  useEffect(() => {
    if (savedAddresses.length > 0 && selectedAddressIdx !== null) {
      const addr = savedAddresses[selectedAddressIdx];
      setShippingFields({
        fullName: addr.fullName || "",
        address: addr.address || "",
        cityStateZip: addr.cityStateZip || "",
        phone: addr.phone || ""
      });
    }
  // eslint-disable-next-line
  }, [selectedAddressIdx]);

  // Handle delivery method change
  const handleDeliveryChange = (method) => {
    setDeliveryMethod(method);
    setShippingCost(method === "express" ? 150 : 50);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ShippingAndDeliveryForm
            values={shippingFields}
            setValues={setShippingFields}
            deliveryMethod={deliveryMethod}
            onDeliveryChange={handleDeliveryChange}
            onNext={() => setStep(2)}
            onAddMore={() => navigate("/products")}
            savedAddresses={savedAddresses}
            selectedAddressIdx={selectedAddressIdx}
            setSelectedAddressIdx={setSelectedAddressIdx}
          />
        );
      case 2:
        // Directly navigate to /payment and do not render PaymentForm
        navigate("/payment");
        return null;
      case 3:
        return <OrderConfirmation />;
      default:
        return null;
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

// Combined Shipping Info and Delivery Method
function ShippingAndDeliveryForm({
  values,
  setValues,
  deliveryMethod,
  onDeliveryChange,
  onNext,
  onAddMore,
  savedAddresses = [],
  selectedAddressIdx,
  setSelectedAddressIdx
}) {
  return (
    <form
      className="bg-white p-6 rounded-lg shadow-md space-y-4"
      onSubmit={e => { e.preventDefault(); onNext(); }}
    >
      <h3 className="text-xl font-semibold">Shipping Address</h3>

      {savedAddresses.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2 text-gray-700">Choose a saved address:</h4>
          <div className="space-y-2">
            {savedAddresses.map((addr, idx) => (
              <label
                key={idx}
                className={`block border rounded p-3 cursor-pointer ${selectedAddressIdx === idx ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
              >
                <input
                  type="radio"
                  name="savedAddress"
                  className="mr-2"
                  checked={selectedAddressIdx === idx}
                  onChange={() => setSelectedAddressIdx(idx)}
                />
                <span className="font-medium">{addr.fullName}</span>, {addr.address}, {addr.cityStateZip}, {addr.phone}
              </label>
            ))}
            <label
              className={`block border rounded p-3 cursor-pointer ${selectedAddressIdx === null ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
            >
              <input
                type="radio"
                name="savedAddress"
                className="mr-2"
                checked={selectedAddressIdx === null}
                onChange={() => setSelectedAddressIdx(null)}
              />
              <span className="font-medium">Enter a new address</span>
            </label>
          </div>
        </div>
      )}

      {/* Only show address form if no saved address or "Enter a new address" is chosen */}
      {(savedAddresses.length === 0 || selectedAddressIdx === null) && (
        <>
          <input
            className="w-full p-2 border rounded"
            placeholder="Full Name"
            required
            value={values.fullName}
            onChange={e => setValues(v => ({ ...v, fullName: e.target.value }))}
          />
          <input
            className="w-full p-2 border rounded"
            placeholder="Address Line 1"
            required
            value={values.address}
            onChange={e => setValues(v => ({ ...v, address: e.target.value }))}
          />
          <input
            className="w-full p-2 border rounded"
            placeholder="City, State, ZIP"
            required
            value={values.cityStateZip}
            onChange={e => setValues(v => ({ ...v, cityStateZip: e.target.value }))}
          />
          <input
            className="w-full p-2 border rounded"
            placeholder="Phone Number"
            required
            value={values.phone}
            onChange={e => setValues(v => ({ ...v, phone: e.target.value }))}
          />
        </>
      )}

      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-2">Choose Delivery Method</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="delivery"
              className="mr-2"
              checked={deliveryMethod === "standard"}
              onChange={() => onDeliveryChange("standard")}
            />
            Standard (₹50, 3–5 days)
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="delivery"
              className="mr-2"
              checked={deliveryMethod === "express"}
              onChange={() => onDeliveryChange("express")}
            />
            Express (₹150, 1–2 days)
          </label>
        </div>
      </div>

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

// Step 3: Order Confirmation
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