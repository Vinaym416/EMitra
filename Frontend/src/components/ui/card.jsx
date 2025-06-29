import React from 'react';
import { Star } from 'lucide-react';
import Badge from './badge';
import Button from './button';
import { useNavigate } from 'react-router-dom';

export default function Card({ product }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white hover:scale-105 transition-transform duration-300 shadow-xl rounded-2xl cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <img
        src={product.image}
        alt={product.name}
        className="rounded-t-2xl h-64 w-full object-cover"
      />
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700 truncate">{product.name}</h2>
          {product.trending && <Badge variant="secondary"> Trending</Badge>}
        </div>
        <p className="text-sm text-gray-500">{product.category}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-pink-600">{product.price}</span>
          <span className="flex items-center text-yellow-500 text-sm">
            <Star className="w-4 h-4 fill-yellow-400 mr-1" /> {product.rating}
          </span>
        </div>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg mt-2">
          Buy Now
        </Button>
      </div>
    </div>
  );
}
