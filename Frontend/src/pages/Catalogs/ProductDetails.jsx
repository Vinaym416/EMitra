<<<<<<< HEAD
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

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

  const handleMouseMove = (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLensPos({ x, y });
=======
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Badge from "../../components/ui/badge";
import Button from "../../components/ui/button";
import { Star } from 'lucide-react';
import toast from "react-hot-toast";
import Header from "../../components/ui/Header";
import BottomNav from "../../components/ui/ButtomNav";
import { useAuth } from "../../contexts/AuthContext"; 
import { axiosInstance } from "../../lib/axios"; 


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

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null); 
  const [cart, setCartState] = useState([]);
  const { authUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setCartState(getCart());
 
    axiosInstance.get(`/catalog/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => setProduct(null));
  }, [id]);

  if (product === null) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-100 to-blue-300">
        <span className="inline-block w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  const isInCart = cart.some(item => item.id === product.id);

  const handleAddToCart = () => {
    if (!authUser) {
      toast.error("Please login to add items to cart.");
      navigate("/login");
      return;
    }
    let cartItems = getCart();
    const priceNumber = Number(product.price.replace(/[^\d]/g, ""));
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
    toast.success(`${product.name} added to cart!`);
>>>>>>> c69955c2e832b7dbda250408413938dcf966c06c
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!product) return <div className="p-8 text-center text-red-500">Product not found</div>;

  return (
<<<<<<< HEAD
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
=======
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-blue-300 p-4 pt-16 pb-16">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 p-5 sm:p-8">
          {/* Image */}
          <div className="flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="rounded-xl shadow-md w-full max-h-96 object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center space-y-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">{product.name}</h1>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{product.description}</p>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge>{product.category}</Badge>
              {product.trending && (
                <Badge variant="secondary" className="text-xs px-2 py-1">🔥 Trending</Badge>
              )}
            </div>

            <div className="flex items-center space-x-6">
              <span className="text-xl md:text-2xl text-pink-600 font-bold">{product.price}</span>
              <span className="flex items-center text-yellow-500 text-sm">
                <Star className="w-4 h-4 fill-yellow-400 mr-1" />
                {product.rating?.rate ?? "N/A"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              {isInCart ? (
                <Button
                  className="bg-gray-400 hover:bg-gray-500 text-white rounded-lg w-full md:w-fit px-5 py-2 shadow-md"
                  onClick={handleRemoveFromCart}
                >
                  Remove from Cart
                </Button>
              ) : (
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-full md:w-fit px-5 py-2 shadow-md"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              )}
              <Button
                className="bg-green-600 hover:bg-green-700 text-white rounded-lg w-full md:w-fit px-5 py-2 shadow-md"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
>>>>>>> c69955c2e832b7dbda250408413938dcf966c06c
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
    </div>
  );
}