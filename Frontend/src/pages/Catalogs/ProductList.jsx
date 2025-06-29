import React, { useState, useEffect } from "react";
import Badge from "../../components/ui/badge";
import Button from "../../components/ui/button";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
import BottomNav from "../../components/ui/ButtomNav";
import { useAuth } from "../../contexts/AuthContext"; 
import ProductCard from "./ProductCard";
import Card from "../../components/ui/card";

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

export default function ProductList() {
  const [cart, setCartState] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { authUser } = useAuth();

  // Fetch products from backend
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost:5001/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
    setCartState(getCart());
  }, []);

  // Add to cart handler
  const handleAddToCart = (product) => {
    if (!authUser) {
      toast.error("Please login to add items to cart.");
      navigate("/login");
      return;
    }
    let cartItems = getCart();
    const existing = cartItems.find((item) => item.id === product._id);
    if (existing) {
      toast("Already added to cart!", { icon: "🛒" });
      return;
    }
    cartItems.push({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      category: product.category,
      image: product.imageUrl,
    });
    setCart(cartItems);
    setCartState(cartItems);
    toast.success(`${product.name} added to cart!`);
  };

  // Remove from cart handler
  const handleRemoveFromCart = (product) => {
    if (!authUser) {
      toast.error("Please login first.");
      navigate("/login");
      return;
    }
    let cartItems = getCart().filter((item) => item.id !== product._id);
    setCart(cartItems);
    setCartState(cartItems);
    toast(`${product.name} removed from cart.`, { icon: "❌" });
  };

  // Helper to check if product is in cart
  const isInCart = (id) => cart.some((item) => item.id === id);

  // Buy Now handler
  const handleBuyNow = (product) => {
    if (!authUser) {
      toast.error("Please login to continue.");
      navigate("/login");
      return;
    }
    navigate('/checkout');
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 p-4 sm:p-6 pt-16 pb-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
            Explore Trending Products
          </h1>
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.length === 0 ? (
                <div className="col-span-full text-center text-gray-500">No products found.</div>
              ) : (
                products.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/products/${product._id}`)}
                    className="cursor-pointer"
                  >
                    <Card product={product} />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
}