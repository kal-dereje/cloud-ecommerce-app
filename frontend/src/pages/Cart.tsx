import React from 'react';
import { useAtom } from 'jotai';
import { Link } from 'react-router-dom';
import { cartAtom } from '../atoms/cartAtom';
import CartItemComp from '../components/CartItem';
import { CartItem } from '../types/types';
import { ArrowRightCircleIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const Cart: React.FC = () => {
  const [cart] = useAtom(cartAtom);
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Placeholder for product data lookup (replace with real product fetch if available)
  const getProductImageUrl = (productId: string): string => {
    // Example: Fetch from API or context
    // const product = await API.get<Product>(`/products/${productId}`);
    // return product.data.imageUrls[0] || 'https://placehold.co/64x64';
    console.log(productId);
    return 'https://placehold.co/64x64'; // Placeholder until product data is provided
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">Your Shopping Cart</h2>
          <p className="text-slate-600">Review and manage your items</p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm  p-12 rounded-3xl shadow-lg text-center transform transition-all duration-300 hover:shadow-xl">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBagIcon className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-600 text-lg mb-6">Your cart is empty</p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              aria-label="Shop now"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden">
            <div className="p-6 space-y-6">
              {cart.map((item: CartItem, index) => (
                <div
                  key={item.productId}
                  className="transform transition-all duration-300 hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CartItemComp
                    item={item}
                    imageUrl={getProductImageUrl(item.productId)}
                  />
                </div>
              ))}
            </div>
            
            <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm py-6 px-6 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-right sm:text-left">
                  <p className="text-sm text-slate-500">Total Amount</p>
                  <p className="text-2xl font-bold text-slate-800">
                    ${total.toFixed(2)}
                  </p>
                </div>
                <Link
                  to="/checkout"
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                  aria-label="Proceed to checkout"
                >
                  <ArrowRightCircleIcon className="h-5 w-5" />
                  <span>Proceed to Checkout</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;