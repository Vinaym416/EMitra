import React, { useState, useEffect } from "react";
import Badge from "../../components/ui/badge";
import Button from "../../components/ui/button";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
import BottomNav from "../../components/ui/ButtomNav";
import { useAuth } from "../../contexts/AuthContext"; 
import { axiosInstance } from "../../lib/axios"; // Add this import

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

  
  useEffect(() => {
    setCartState(getCart());
    axiosInstance
      .get("/catalog/")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load products");
        setLoading(false);
      });
  }, []);

  // Add to cart handler
  const handleAddToCart = (product) => {
    if (!authUser || !authUser.id) {
      toast.error("Please login to add items to cart.");
      navigate("/login");
      return;
    }
    let cartItems = getCart();
    // Use price as number directly
    const priceNumber = typeof product.price === "number" ? product.price : Number(product.price?.replace(/[^\d]/g, ""));
    const existing = cartItems.find((item) => item.id === product.id);
    if (existing) {
      toast("Already added to cart!", { icon: "🛒" });
      return;
    }
    cartItems.push({
      id: product.id,
      name: product.name,
      price: priceNumber,
      quantity: 1,
      category: product.category,
      image: product.image,
    });
    setCart(cartItems);
    setCartState(cartItems);
    toast.custom(
      (t) => (
        <div
          className={`bg-white shadow-lg rounded-lg px-4 py-3 flex items-center gap-3 border-l-4 border-blue-500 ${
            t.visible ? "animate-slide-in" : "animate-slide-out"
          }`}
          style={{
            position: "fixed",
            top: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            margin: "0 auto",
            minWidth: "260px",
            maxWidth: "90vw",
          }}
        >
          <span className="text-green-600 font-bold">Added to cart!</span>
          <button
            className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => {
              toast.dismiss(t.id);
              navigate("/cart");
            }}
          >
            Go to Cart
          </button>
        </div>
      ),
      { duration: 3500 }
    );
  };

  // Remove from cart handler
  const handleRemoveFromCart = (product) => {
    if (!authUser) {
      toast.error("Please login first.");
      navigate("/login");
      return;
    }
    let cartItems = getCart().filter((item) => item.id !== product.id);
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
    // Optionally, you can add the product to cart here if needed
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
            <div className="flex justify-center items-center py-10">
              <span className="inline-block w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((product) => {
                const inCart = isInCart(product.id);
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow hover:shadow-md transition duration-300 cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="rounded-t-lg w-full h-40 sm:h-48 object-cover"
                    />
                    <div className="p-3 space-y-1" onClick={e => e.stopPropagation()}>
                      <div className="flex justify-between items-center">
                        <h2 className="text-sm font-semibold text-gray-800 truncate">
                          {product.name}
                        </h2>
                        {product.trending && (
                          <Badge
                            variant="secondary"
                            className="text-xs px-2 py-0.5"
                          >
                            Trending
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{product.category}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-base font-bold text-pink-600">
                          {product.price}
                        </span>
                        <span className="flex items-center text-yellow-500 text-xs">
                          <Star className="w-4 h-4 fill-yellow-400 mr-1" />{" "}
                          {product.rating?.rate ?? "N/A"}
                        </span>
                      </div>
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white rounded-lg w-full  px-5 py-2 shadow-md"
                        onClick={() => handleBuyNow(product)}
                      >
                        Buy Now
                      </Button>
                      {inCart ? (
                        <Button
                          className="w-full bg-gray-400 hover:bg-gray-500 text-white rounded-md py-1 mt-1 text-sm"
                          onClick={() => handleRemoveFromCart(product)}
                        >
                          Remove from Cart
                        </Button>
                      ) : (
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-1 mt-1 text-sm"
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to Cart
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
