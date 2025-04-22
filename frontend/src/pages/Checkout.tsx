import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { cartAtom } from '../atoms/cartAtom';
import { userAtom } from '../atoms/userAtoms';
import { CartItem, User } from '../types/types';
import { CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import API from '../api';

const Checkout: React.FC = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const [user] = useAtom(userAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Placeholder for product data lookup (replace with real product fetch if available)
  const getProductData = (productId: string): { name: string; imageUrl: string } => {
    // Example: Fetch from API or context
    // const product = await API.get<Product>(`/products/${productId}`);
    // return { name: product.data.name, imageUrl: product.data.imageUrls[0] || 'https://placehold.co/80x80' };
    return { name: 'Product Name', imageUrl: 'https://placehold.co/80x80' }; // Placeholder
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    if (!user) {
      setError('Please log in to place an order.');
      return;
    }
    if (
      !shippingAddress.fullName ||
      !shippingAddress.addressLine1 ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {
      setError('Please fill in all required shipping address fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get the ID token from localStorage
      const idToken = localStorage.getItem('idToken');
      if (!idToken) {
        throw new Error('Authentication token not found');
      }

      // Format the order data according to the API requirements
      const orderData = {
        items: cart.map((item: CartItem) => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        shippingAddress: `${shippingAddress.addressLine1}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}, ${shippingAddress.country}`,
        total: total
      };

      // Make the API call to place the order with Authorization header
      const response = await API.post('/orders', orderData, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      if (response.data) {
        // Clear the cart after successful order
        setCart([]);
        // Navigate to orders page
        navigate('/orders');
      }
    } catch (err: any) {
      console.error('Error placing order:', err);
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        // Optionally redirect to login page
        navigate('/login');
      } else {
        setError('Failed to place order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Cart</span>
          </button>
          <h2 className="text-4xl font-bold text-slate-800">Checkout</h2>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-lg text-center transform transition-all duration-300 hover:shadow-xl">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-600 text-lg mb-6">Your cart is empty</p>
            <button
              onClick={() => navigate('/products')}
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              aria-label="Shop now"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden">
            <div className="p-8 space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-slate-800 mb-6">Order Summary</h3>
                <div className="space-y-4">
                  {cart.map((item: CartItem, index) => {
                    const { name, imageUrl } = getProductData(item.productId);
                    return (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between p-4 bg-white/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={imageUrl}
                            alt={name}
                            className="w-20 h-20 object-cover rounded-xl shadow-sm"
                            onError={(e) => {
                              e.currentTarget.src = 'https://placehold.co/80x80';
                              e.currentTarget.onerror = null;
                            }}
                          />
                          <div>
                            <h4 className="font-semibold text-slate-800">{name}</h4>
                            <p className="text-slate-600">
                              {item.quantity} x ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <p className="font-bold text-slate-800">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-slate-800 mb-6">Shipping Address</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                      className="w-full p-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="John Doe"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label htmlFor="addressLine1" className="block text-sm font-medium text-slate-700 mb-2">
                      Address Line 1 *
                    </label>
                    <input
                      id="addressLine1"
                      type="text"
                      value={shippingAddress.addressLine1}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                      className="w-full p-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="123 Main St"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label htmlFor="addressLine2" className="block text-sm font-medium text-slate-700 mb-2">
                      Address Line 2
                    </label>
                    <input
                      id="addressLine2"
                      type="text"
                      value={shippingAddress.addressLine2}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })}
                      className="w-full p-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Apt, Suite, etc."
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-2">
                      City *
                    </label>
                    <input
                      id="city"
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="w-full p-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="New York"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-slate-700 mb-2">
                      State *
                    </label>
                    <input
                      id="state"
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="w-full p-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="NY"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-slate-700 mb-2">
                      Postal Code *
                    </label>
                    <input
                      id="postalCode"
                      type="text"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      className="w-full p-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="10001"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-slate-700 mb-2">
                      Country *
                    </label>
                    <input
                      id="country"
                      type="text"
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                      className="w-full p-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="United States"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm py-6 px-8 border-t border-slate-200">
              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl text-center animate-pulse">
                  {error}
                </div>
              )}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-right sm:text-left">
                  <p className="text-sm text-slate-500">Total Amount</p>
                  <p className="text-2xl font-bold text-slate-800">
                    ${total.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || cart.length === 0}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                  aria-label="Place order"
                >
                  <CheckCircleIcon className="h-5 w-5" />
                  <span>{loading ? 'Placing Order...' : 'Place Order'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;