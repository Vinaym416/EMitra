import React from "react";
import { Star } from "lucide-react";
import Badge from "./badge";
import Button from "./button";

export default function Card({ product, children, showActions = true }) {
  return (
      <div className="bg-white shadow-lg rounded-xl transition-transform duration-300 hover:scale-105">
      <img
        src={product.imageUrl}
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
          {product.rating && (
            <span className="flex items-center text-yellow-500 text-xs">
              <Star className="w-4 h-4 fill-yellow-400 mr-1" />
              {product.rating}
            </span>
          )}
        </div>

        {showActions && (
          <div className="pt-2 space-y-2">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-md"
            >
              Buy Now
            </Button>

            <Button
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-2 rounded-md border"
            >
              Add to Cart
            </Button>
          </div>
        )}

        {children && <div className="pt-2">{children}</div>}
      </div>
    </div>
  );
}
