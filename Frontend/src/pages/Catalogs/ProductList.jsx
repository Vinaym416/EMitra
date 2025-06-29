import React from 'react';
import Card from "../../components/ui/card";
import Badge from "../../components/ui/badge";
import Button from "../../components/ui/button";
import { Star } from 'lucide-react';

const dummyProducts = [
  {
    id: 1,
    name: 'Women Floral Dress',
    price: '₹799',
    rating: 4.5,
    category: 'Clothing',
    image: 'https://source.unsplash.com/300x400/?dress,women',
    trending: true,
  },
  {
    id: 2,
    name: 'Organic Lipstick Combo',
    price: '₹499',
    rating: 4.2,
    category: 'Cosmetics',
    image: 'https://source.unsplash.com/300x400/?lipstick,makeup',
    trending: false,
  },
  {
    id: 3,
    name: 'Men Casual Shirt',
    price: '₹699',
    rating: 4.0,
    category: 'Clothing',
    image: 'https://source.unsplash.com/300x400/?shirt,men',
    trending: true,
  },
  {
    id: 4,
    name: 'Night Glow Face Cream',
    price: '₹599',
    rating: 4.6,
    category: 'Cosmetics',
    image: 'https://source.unsplash.com/300x400/?facecream,beauty',
    trending: true,
  },
];

export default function ProductList() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Explore Trending Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* {dummyProducts.map((product) => (
            <Card key={product.id} className="hover:scale-105 transition-transform duration-300 shadow-xl rounded-2xl">
              <img
                src={product.image}
                alt={product.name}
                className="rounded-t-2xl h-64 w-full object-cover"
              />
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-700">{product.name}</h2>
                  {product.trending && <Badge variant="secondary"> Trending</Badge>}
                </div>
                <p className="text-sm text-gray-500">{product.category}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-pink-600">{product.price}</span>
                  <span className="flex items-center text-yellow-500 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 mr-1" /> {product.rating}
                  </span>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg mt-2">Buy Now</Button>
              </div>
            </Card>
          ))} */}


          {dummyProducts.map((product) => (
            <Card key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
