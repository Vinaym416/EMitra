import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/card';
import Button from '../../components/ui/button';
import { Trash2, Plus, Minus, Heart } from 'lucide-react';
import Header from "../../components/ui/Header";
import BottomNav from "../../components/ui/ButtomNav";

// Helper to get and set cart in localStorage
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cartItems")) || [];
  } catch {
    return [];
  }
}
function setCart(items) {
  localStorage.setItem("cartItems", JSON.stringify(items));
}

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const navigate = useNavigate();

  // Load cart from localStorage on mount
  useEffect(() => {
    setCartItems(getCart());
  }, []);

  // Update localStorage whenever cartItems changes
  useEffect(() => {
    setCart(getCart()); // keep in sync in case other tabs update
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const incrementQty = (id) => {
    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updated);
    setCart(updated);
  };

  const decrementQty = (id) => {
    const updated = cartItems.map(item =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updated);
    setCart(updated);
  };

  const removeItem = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    setCart(updated);
  };

  const saveForLater = (id) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      const updatedCart = cartItems.filter(i => i.id !== id);
      setCartItems(updatedCart);
      setSavedItems(items => [...items, item]);
      setCart(updatedCart);
    }
  };

  const moveToCart = (id) => {
    const item = savedItems.find(item => item.id === id);
    if (item) {
      setSavedItems(items => items.filter(i => i.id !== id));
      const updatedCart = [...cartItems, { ...item, quantity: 1 }];
      setCartItems(updatedCart);
      setCart(updatedCart);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 p-3 sm:p-5 pb-32 pt-16">
        {/* Fixed Top Bar */}
        <div className="fixed top-0 left-0 w-full z-30 bg-white shadow-md py-3 px-4 flex justify-between items-center">
          <span className="font-medium text-sm sm:text-base text-gray-700">Subtotal</span>
          <span className="text-base sm:text-lg font-bold text-pink-600">
            ₹{subtotal.toLocaleString()}
          </span>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-1.5 text-sm shadow-sm"
            onClick={() => navigate('/payment')}
          >
            Proceed to Checkout
          </Button>
        </div>

        <div className="max-w-6xl mx-auto pt-24">
          <h1 className="text-xl sm:text-2xl font-bold mb-5 text-center text-gray-800">Your Cart</h1>

          {/* Cart Items */}
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-600 text-base">Your cart is empty.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {cartItems.map((item) => (
                <Card key={item.id} product={item} className="!p-3 shadow-md bg-white rounded-lg">
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center gap-1">
                      <Button
                        disabled={item.quantity <= 1}
                        className={`bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full p-1 h-7 w-7 ${
                          item.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          decrementQty(item.id);
                        }}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-gray-800 font-medium text-sm">{item.quantity}</span>
                      <Button
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full p-1 h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          incrementQty(item.id);
                        }}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        className="bg-pink-100 hover:bg-pink-200 text-pink-600 rounded-md flex items-center gap-1 px-2 py-1 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          saveForLater(item.id);
                        }}
                      >
                        <Heart className="w-3 h-3" /> Save
                      </Button>
                      <Button
                        className="bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center gap-1 px-2 py-1 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(item.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Saved for Later */}
          {savedItems.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-700">Saved for Later</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {savedItems.map(item => (
                  <Card key={item.id} product={item} className="!p-3 shadow-md bg-white rounded-lg">
                    <div className="flex justify-between items-center mt-3">
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-1.5 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveToCart(item.id);
                        }}
                      >
                        Move to Cart
                      </Button>
                      <Button
                        className="bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center gap-1 px-2 py-1 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSavedItems(items => items.filter(i => i.id !== item.id));
                        }}
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg p-5 text-right">
              <div className="flex justify-between mb-2 text-sm sm:text-base">
                <span className="text-gray-700 font-medium">Subtotal</span>
                <span className="text-gray-800">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2 text-sm sm:text-base">
                <span className="text-gray-700 font-medium">Shipping</span>
                <span className="text-gray-800">₹0</span>
              </div>
              <div className="flex justify-between border-t pt-3 mt-3 text-base sm:text-lg font-bold text-gray-900">
                <span>Order Total</span>
                <span className="text-pink-600">₹{subtotal.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
}