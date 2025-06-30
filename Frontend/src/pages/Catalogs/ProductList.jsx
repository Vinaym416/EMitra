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
  const [justAddedId, setJustAddedId] = useState(null); 
  const [showGoToCart, setShowGoToCart] = useState(false);
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
      toast.error("Please login to add items to cart.", {
        style: {
          fontSize: "0.85rem",
          minWidth: "160px",
          maxWidth: "90vw",
          padding: "0.5rem 1rem",
          borderRadius: "0.5rem",
        },
      });
      navigate("/login");
      return;
    }
    let cartItems = getCart();
    const existing = cartItems.find((item) => item.id === product._id);
    if (existing) {
      toast("Already added to cart!", {
        icon: "🛒",
        style: {
          fontSize: "0.85rem",
          minWidth: "160px",
          maxWidth: "90vw",
          padding: "0.5rem 1rem",
          borderRadius: "0.5rem",
        },
      });
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
    setJustAddedId(product._id); 
    setShowGoToCart(true); 
    toast.success(` added `, {
      style: {
      fontSize: "0.7rem",
          minWidth: "100px",
          maxWidth: "70vw",
          padding: "0.2rem 0.5rem",
          borderRadius: "0.3rem",
        },
    });
   
    setTimeout(() => setJustAddedId(null), 3000);
    setTimeout(() => setShowGoToCart(false), 5000);
  };

  // Remove from cart handler
  const handleRemoveFromCart = (product) => {
    if (!authUser) {
      toast.error("Please login first.", {
        style: {
          fontSize: "0.7rem",
          minWidth: "100px",
          maxWidth: "70vw",
          padding: "0.2rem 0.5rem",
          borderRadius: "0.3rem",
        },
      });
      navigate("/login");
      return;
    }
    let cartItems = getCart().filter((item) => item.id !== product._id);
    setCart(cartItems);
    setCartState(cartItems);
    toast(`removed`, {
      icon: "❌",
      style: {
       fontSize: "0.7rem",
          minWidth: "100px",
          maxWidth: "70vw",
          padding: "0.2rem 0.5rem",
          borderRadius: "0.3rem",
        },
    });
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
    
    sessionStorage.setItem("buyNowProduct", JSON.stringify(product));
    navigate('/checkout?buynow=1');
  };

  return (
    <>
      <Header />
      {/* Go to Cart Suggestion */}
      {showGoToCart && (
        <div className="flex justify-center mt-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all animate-bounce"
            style={{ zIndex: 50 }}
            onClick={() => navigate("/cart")}
          >
            🛒 Go to Cart
          </button>
        </div>
      )}
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 p-4 sm:p-6 pt-16 pb-16 ">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
            Explore Trending Products
          </h1>
          {loading ? (
            <div className="flex flex-col items-center py-10">
              <span className="mb-2 text-blue-700 font-semibold">Loading...</span>
              <span className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
            </div>
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
                    <Card
                      product={product}
                      showActions={true}
                      onBuyNow={() => handleBuyNow(product)}
                      onAddToCart={() => handleAddToCart(product)}
                      onRemoveFromCart={() => handleRemoveFromCart(product)}
                      isInCart={isInCart(product._id)}
                      justAdded={justAddedId === product._id}
                    />
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