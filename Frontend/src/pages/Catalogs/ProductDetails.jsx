import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../components/ui/Header";
import BottomNav from "../../components/ui/ButtomNav";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Zoom lens state
  const [showLens, setShowLens] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);

  const lensSize = 150; // px
  const zoom = 2; // magnification

  // Cart state
  const [isInCart, setIsInCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const navigate = useNavigate();
  const { authUser } = useAuth();

  // Helper functions for cart
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

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`http://localhost:5001/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  // Check if in cart
  useEffect(() => {
    if (product) {
      const cart = getCart();
      setIsInCart(cart.some((item) => item.id === product._id));
    }
  }, [product]);

  const handleMouseMove = (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLensPos({ x, y });
  };

  const handleAddToCart = () => {
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
    setIsInCart(true);
    setJustAdded(true);
    toast.success(`${product.name} added to cart!`, {
      style: {
        fontSize: "0.85rem",
        minWidth: "160px",
        maxWidth: "90vw",
        padding: "0.5rem 1rem",
        borderRadius: "0.5rem",
      },
    });
    setTimeout(() => setJustAdded(false), 3000);
  };

  const handleRemoveFromCart = () => {
    let cartItems = getCart().filter((item) => item.id !== product._id);
    setCart(cartItems);
    setIsInCart(false);
    toast(`${product.name} removed from cart.`, {
      icon: "❌",
      style: {
        fontSize: "0.85rem",
        minWidth: "160px",
        maxWidth: "90vw",
        padding: "0.5rem 1rem",
        borderRadius: "0.5rem",
      },
    });
  };

  const handleBuyNow = () => {
    if (!authUser) {
      toast.error("Please login to continue.");
      navigate("/login");
      return;
    }
    sessionStorage.setItem("buyNowProduct", JSON.stringify(product));
    navigate('/checkout?buynow=1');
  };

  if (loading) return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex items-center justify-center">
        <div className="p-8 text-center">Loading...</div>
      </div>
      <BottomNav />
    </>
  );
  if (!product) return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex items-center justify-center">
        <div className="p-8 text-center text-red-500">Product not found</div>
      </div>
      <BottomNav />
    </>
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 pt-16 pb-20 px-2">
        <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow mt-8">
          <div
            className="relative w-full h-64 mb-4"
            onMouseEnter={() => setShowLens(true)}
            onMouseLeave={() => setShowLens(false)}
            onMouseMove={handleMouseMove}
            style={{ width: "100%", height: "256px" }}
          >
            <img
              ref={imgRef}
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg"
              style={{ display: "block" }}
            />
            {showLens && (
              <div
                style={{
                  position: "absolute",
                  pointerEvents: "none",
                  left: lensPos.x - lensSize / 2,
                  top: lensPos.y - lensSize / 2,
                  width: lensSize,
                  height: lensSize,
                  borderRadius: "50%",
                  border: "2px solid #fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  backgroundImage: `url(${product.imageUrl})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: `${imgRef.current?.offsetWidth * zoom}px ${imgRef.current?.offsetHeight * zoom}px`,
                  backgroundPosition: `-${lensPos.x * zoom - lensSize / 2}px -${lensPos.y * zoom - lensSize / 2}px`,
                  zIndex: 10,
                }}
              />
            )}
          </div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-pink-600 font-semibold text-lg mb-2">₹{product.price}</p>
          <p className="text-gray-700 mb-2">{product.description}</p>
          <p className="text-gray-500 text-sm mb-2">Category: {product.category}</p>
          <a
            href={product.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View on Store
          </a>
          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-6 rounded-md transition"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
            {justAdded ? (
              <button
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-6 rounded-md transition"
                onClick={() => navigate("/cart")}
              >
                Go to Cart
              </button>
            ) : isInCart ? (
              <button
                className="w-full sm:w-auto bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold py-2 px-6 rounded-md border"
                onClick={handleRemoveFromCart}
              >
                Remove from Cart
              </button>
            ) : (
              <button
                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold py-2 px-6 rounded-md border"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}