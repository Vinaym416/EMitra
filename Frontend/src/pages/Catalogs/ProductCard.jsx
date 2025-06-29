import React from 'react';
import Card from "../../components/ui/card";
import Badge from "../../components/ui/badge";
import Button from "../../components/ui/button";
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext"; 

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { authUser } = useAuth(); 

  // Add to Cart handler
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!authUser) {
      toast.error("Please login to add items to cart.");
      navigate("/login");
      return;
    }
    // Add your add-to-cart logic here (update localStorage, etc.)
    toast.success(`Added "${product.name}" to cart.`);
  };

  // Buy Now handler
  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (!authUser) {
      toast.error("Please login to continue.");
      navigate("/login");
      return;
    }
    navigate('/checkout');
  };

  return (
    <Card
      className="hover:scale-[1.03] transition-transform duration-300 shadow-lg rounded-xl cursor-pointer bg-white"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <img
        src={product.image}
        alt={product.name}
        className="rounded-t-xl h-48 sm:h-56 w-full object-cover"
      />

      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold text-gray-800 truncate">{product.name}</h2>
          {product.trending && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5">Trending</Badge>
          )}
        </div>

        <p className="text-xs text-gray-500">{product.category}</p>

        <div className="flex justify-between items-center text-sm">
          <span className="text-base font-bold text-pink-600">{product.price}</span>
          <span className="flex items-center text-yellow-500 text-xs">
            <Star className="w-4 h-4 fill-yellow-400 mr-1" />
            {product.rating}
          </span>
        </div>

        <div className="pt-2 space-y-2">
          <Button
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg w-full md:w-fit px-5 py-2 shadow-md"
            onClick={handleBuyNow}
          >
            Buy Now
          </Button>

          <Button
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-2 rounded-md border"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
}
