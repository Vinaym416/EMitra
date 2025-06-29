import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Badge from "../../components/ui/badge";
import Button from "../../components/ui/button";
import { Star } from 'lucide-react';
import toast from "react-hot-toast";
import Header from "../../components/ui/Header";
import BottomNav from "../../components/ui/ButtomNav";
import { useAuth } from "../../contexts/AuthContext"; 

const dummyProducts = [
  {
    id: 1,
    name: 'Women Floral Dress',
    price: '₹799',
    rating: 4.5,
    category: 'Clothing',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2G3-RHjmhpIOJVaZJI0mRQXGEy9R-zLeorw&s',
    trending: true,
    description: 'Beautiful floral printed dress for casual or party wear.',
  },
  {
    id: 2,
    name: 'Organic Lipstick Combo',
    price: '₹499',
    rating: 4.2,
    category: 'Cosmetics',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKMNu--s5kpPokQZWzT1QvjCqhkg3YyZViEw&s',
    trending: false,
    description: 'A set of organic lipsticks for long-lasting color and care.',
  },
];

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

export default function ProductDetails() {
  const { id } = useParams();
  const product = dummyProducts.find((p) => p.id === parseInt(id));
  const [cart, setCartState] = useState([]);
  const { authUser } = useAuth(); // <-- Use auth context
  const navigate = useNavigate();

  useEffect(() => {
    setCartState(getCart());
  }, []);

  if (!product)
    return (
      <div className="text-center mt-20 text-red-600 text-xl font-semibold">
        Product not found
      </div>
    );

  const isInCart = cart.some(item => item.id === product.id);

  const handleAddToCart = () => {
    if (!authUser) {
      toast.error("Please login to add items to cart.");
      navigate("/login");
      return;
    }
    let cartItems = getCart();
    const priceNumber = Number(product.price.replace(/[^\d]/g, ""));
    const existing = cartItems.find(item => item.id === product.id);
    if (existing) {
      toast('Already added to cart!', { icon: '🛒' });
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
  };

  const handleRemoveFromCart = () => {
    if (!authUser) {
      toast.error("Please login first.");
      navigate("/login");
      return;
    }
    let cartItems = getCart().filter(item => item.id !== product.id);
    setCart(cartItems);
    setCartState(cartItems);
    toast(`${product.name} removed from cart.`, { icon: '❌' });
  };

  const handleBuyNow = () => {
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
                {product.rating}
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
      </div>
      <BottomNav />
    </>
  );
}