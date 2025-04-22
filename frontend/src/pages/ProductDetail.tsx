import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { cartAtom } from '../atoms/cartAtom';
import { Product, CartItem } from '../types/types';
import ReviewStars from '../components/ReviewStars';
import API from '../api';

// interface RouteParams {
//   id: string;
// }

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setCart] = useAtom(cartAtom);

  useEffect(() => {
    if (!id) {
      console.error('Product ID is undefined');
      setError('Invalid product ID');
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      try {
        console.log('Fetching product with ID:', id);
        const response = await API.get(`/products/${id}`);
        console.log('API Response:', response.data);
        
        if (response.data) {
          // Handle both full and simplified product formats
          const productData = {
            ...response.data,
            // Set default values for missing fields
            description: response.data.description || 'No description available',
            currency: response.data.currency || '$',
            brand: response.data.brand || 'Unknown Brand',
            tags: response.data.tags || [],
            imageUrls: response.data.imageUrls || ['https://placehold.co/300x192'],
            timesOrdered: response.data.timesOrdered || 0,
            rating: response.data.rating || 0,
            discountPrice: response.data.discountPrice,
            isActive: response.data.isActive ?? true
          };
          console.log('Processed Product data:', productData);
          setProduct(productData);
        } else {
          console.error('Product data is undefined');
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = () => {
    if (product) {
      const cartItem: CartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      };
      setCart((curr) => {
        const existingItemIndex = curr.findIndex((item) => item.productId === cartItem.productId);
        if (existingItemIndex > -1) {
          const updatedCart = curr.map((item, index) =>
            index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
          );
          return updatedCart;
        } else {
          return [...curr, cartItem];
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center animate-fade-in">
          <p className="text-gray-600 text-base mb-3">{error || 'Product not found'}</p>
          <a
            href="/products"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Back to Products
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white rounded-xl shadow-lg p-6">
          {/* Image Section */}
          <div className="relative group overflow-hidden rounded-lg">
            {product.imageUrls && product.imageUrls.length > 0 && (
              <img
                src={product.imageUrls[0]}
                alt={product.name}
                className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">{product.name}</h2>
              <div className="flex items-center mb-3">
                <ReviewStars rating={product.rating || 0} />
                <span className="ml-2 text-gray-600 text-sm">
                  ({product.rating ? product.rating.toFixed(1) : '0'} / 5)
                </span>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed text-sm">{product.description}</p>
              <p className="text-2xl font-semibold text-gray-800 mb-3">
                ${product.price?.toFixed(2)} {product.currency}
              </p>
              {product.discountPrice !== undefined && product.discountPrice < product.price && (
                <p className="text-base text-red-600 line-through mb-2">
                  ${product.price?.toFixed(2)}
                </p>
              )}
              <div className="space-y-2 mb-4">
                <p className="text-gray-700 text-sm">
                  Availability: {product.stock > 0 ? <span className="text-green-600">In Stock</span> : <span className="text-red-600">Out of Stock</span>}
                </p>
                <p className="text-gray-700 text-sm">
                  Brand: {product.brand}
                </p>
                <p className="text-gray-700 text-sm">
                  Category: {product.category}
                </p>
              </div>
              {product.tags && product.tags.length > 0 && (
                <div className="mb-4">
                  <span className="text-gray-700 font-semibold text-sm">Tags:</span>{' '}
                  {product.tags.map((tag) => (
                    <span key={tag} className="inline-block bg-gray-200 rounded-full px-2 py-0.5 text-xs font-semibold text-gray-700 mr-1.5">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Sticky Add to Cart */}
            <div className="sticky bottom-0 bg-white py-3 -mx-6 px-6 border-t border-gray-200">
              <button
                onClick={addToCart}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Product Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-base font-semibold text-gray-700 mb-1">Description</h4>
              <p className="text-gray-600 text-sm">{product.description}</p>
            </div>
            <div>
              <h4 className="text-base font-semibold text-gray-700 mb-1">Ratings</h4>
              <div className="flex items-center">
                <ReviewStars rating={product.rating || 0} />
                <span className="ml-2 text-gray-600 text-sm">Based on user reviews</span>
              </div>
            </div>
            {product.timesOrdered !== undefined && (
              <div>
                <h4 className="text-base font-semibold text-gray-700 mb-1">Times Ordered</h4>
                <p className="text-gray-600 text-sm">{product.timesOrdered} times</p>
              </div>
            )}
            <div>
              <h4 className="text-base font-semibold text-gray-700 mb-1">Created At</h4>
              <p className="text-gray-600 text-sm">{new Date(product.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <h4 className="text-base font-semibold text-gray-700 mb-1">Updated At</h4>
              <p className="text-gray-600 text-sm">{new Date(product.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;