import React, { useEffect, useState } from 'react';
import { Order, Product } from '../types/types';
import { ArrowDownIcon,  ShoppingBagIcon } from '@heroicons/react/24/outline';
import API from '../api';

// interface OrderItemDisplay {
//   productId: string;
//   quantity: number;
//   product?: Product;
// }

interface OrderResponse {
  message: string;
  orders: Order[];
  lastEvaluatedKey: string | null;
  hasMore: boolean;
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productDetails, setProductDetails] = useState<Record<string, Product>>({});

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get the ID token from localStorage
        const idToken = localStorage.getItem('idToken');
        if (!idToken) {
          throw new Error('Authentication token not found');
        }

        // Fetch orders with Authorization header
        const response = await API.get<OrderResponse>('/orders', {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        });

        if (response.data && response.data.orders) {
          setOrders(response.data.orders);
          
          // Fetch product details for all unique product IDs
          const uniqueProductIds = new Set<string>();
          response.data.orders.forEach(order => {
            order.items.forEach(item => {
              uniqueProductIds.add(item.productId);
            });
          });

          // Fetch product details for each unique product ID
          const productDetailsMap: Record<string, Product> = {};
          for (const productId of uniqueProductIds) {
            try {
              const productResponse = await API.get<Product>(`/products/${productId}`);
              productDetailsMap[productId] = productResponse.data;
            } catch (err) {
              console.error(`Failed to fetch product details for ${productId}:`, err);
            }
          }
          setProductDetails(productDetailsMap);
        }
      } catch (err: any) {
        console.error('Failed to fetch order history:', err);
        if (err.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
        } else {
          setError('Failed to load order history. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold text-slate-800">Your Order History</h2>
          <button
            onClick={() => window.location.href = '/products'}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <ShoppingBagIcon className="h-5 w-5" />
            <span>Shop Now</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-center animate-pulse">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-lg text-center transform transition-all duration-300 hover:shadow-xl">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBagIcon className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-600 text-lg mb-6">No past orders found</p>
            <button
              onClick={() => window.location.href = '/products'}
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div
                key={order.orderId}
                className="relative bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Timeline Dot */}
                <div className="absolute -left-3 top-6 w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full border-4 border-white shadow-md"></div>
                
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800">
                      Order #{order.orderId}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-slate-50/50 p-4 rounded-2xl">
                    <p className="text-slate-600 mb-2">Total Amount</p>
                    <p className="text-2xl font-bold text-slate-800">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                  <div className="md:text-right">
                    <details className="group">
                      <summary className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center justify-end space-x-2">
                        <span className="font-medium">View Items</span>
                        <ArrowDownIcon className="w-5 h-5 transform group-open:rotate-180 transition-transform duration-200" />
                      </summary>
                      <div className="mt-4 space-y-4">
                        {order.items.map((item) => {
                          const product = productDetails[item.productId];
                          return (
                            <div
                              key={item.productId}
                              className="flex items-start space-x-4 p-4 bg-white/50 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                              {product?.imageUrls && product.imageUrls.length > 0 && (
                                <img
                                  src={product.imageUrls[0]}
                                  alt={product.name}
                                  className="w-20 h-20 object-cover rounded-lg"
                                />
                              )}
                              <div className="flex-1">
                                {product ? (
                                  <>
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h4 className="font-semibold text-slate-800">{product.name}</h4>
                                        <p className="text-sm text-slate-500 mt-1">{product.category}</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-medium text-slate-800">${product.price.toFixed(2)}</p>
                                        <p className="text-sm text-slate-500">x {item.quantity}</p>
                                      </div>
                                    </div>
                                    <div className="mt-2 flex items-center space-x-2">
                                      <span className="text-sm text-slate-500">Subtotal:</span>
                                      <span className="font-medium text-slate-800">
                                        ${(product.price * item.quantity).toFixed(2)}
                                      </span>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex justify-between items-center w-full">
                                    <p className="font-medium text-slate-800">Product ID: {item.productId}</p>
                                    <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </details>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-slate-50/50 rounded-2xl">
                  <p className="text-slate-600 mb-2">Shipping Address</p>
                  <p className="text-slate-800">{"${order.shippingAddress}"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;