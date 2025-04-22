import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import { cartAtom } from '../atoms/cartAtom';
import ReviewStars from './ReviewStars';
import { Product, CartItem } from '../types/types';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const [, setCart] = useAtom(cartAtom);
  const [isAnimating, setIsAnimating] = useState(false);

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    setIsAnimating(true);
    
    setCart((curr) => {
      const exists = curr.find((item) => item.productId === product.id);
      if (exists) {
        return curr.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      const newItem: CartItem = {
        productId: product.id,
        name: product.name,
        price: product.discountPrice || product.price,
        quantity: 1,
      };
      return [...curr, newItem];
    });

    setTimeout(() => setIsAnimating(false), 1000);
  };

  const imageUrl = product.imageUrls?.[0] || 'https://placehold.co/300x192';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative pb-[75%] overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="absolute top-0 left-0 w-full h-full object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              (e.target as HTMLImageElement).src = 'https://placehold.co/300x192';
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </span>
            {product.stock > 0 ? (
              <span className="text-sm text-green-600">In Stock</span>
            ) : (
              <span className="text-sm text-red-600">Out of Stock</span>
            )}
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button
          onClick={addToCart}
          disabled={product.stock <= 0}
          className={`w-full py-2 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 ${
            product.stock > 0
              ? 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          } ${isAnimating ? 'animate-bounce' : ''}`}
        >
          <ShoppingCartIcon className="w-5 h-5" />
          <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;