import React from 'react';
import { useParams } from 'react-router-dom';
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
    image: 'https://source.unsplash.com/600x800/?dress,women',
    trending: true,
    description: 'Beautiful floral printed dress for casual or party wear.',
  },
  {
    id: 2,
    name: 'Organic Lipstick Combo',
    price: '₹499',
    rating: 4.2,
    category: 'Cosmetics',
    image: 'https://source.unsplash.com/600x800/?lipstick,makeup',
    trending: false,
    description: 'A set of organic lipsticks for long-lasting color and care.',
  },
  // Add more products as needed
];

export default function ProductDetails() {
  const { id } = useParams();
  const product = dummyProducts.find((p) => p.id === parseInt(id));

  if (!product) return <div className="text-center mt-20 text-red-600 text-xl">Product not found</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-blue-300 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <img
          src={product.image}
          alt={product.name}
          className="rounded-2xl shadow-md w-full object-cover max-h-96"
        />
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-gray-600 text-md">{product.description}</p>
          <div className="flex items-center space-x-2">
            <Badge>{product.category}</Badge>
            {product.trending && <Badge variant="secondary">🔥 Trending</Badge>}
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-xl md:text-2xl text-pink-600 font-bold">{product.price}</span>
            <span className="flex items-center text-yellow-500 text-sm">
              <Star className="w-5 h-5 fill-yellow-400 mr-1" /> {product.rating}
            </span>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl mt-4 w-full md:w-auto">
            Order Now
          </Button>
        </div>
      </div>
    </div>
  );
}
