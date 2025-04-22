import React, { useEffect, useState } from 'react';
import { mockGetAdminOrders, mockPatchAdminOrders } from '../mocks/mock';
import { Order } from '../types/types';
import { 
  ChevronDownIcon, 
  ChevronUpIcon,
  ShoppingBagIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const ManageOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await mockGetAdminOrders();
      setOrders(res.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, status: Order['status']) => {
    setLoading(true);
    setError(null);
    try {
      await mockPatchAdminOrders(orderId, status);
      setOrders((currOrders) =>
        currOrders.map((order) =>
          order.orderId === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error('Failed to update order status:', error);
      setError('Failed to update order status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return <ClockIcon className="w-5 h-5 text-yellow-400" />;
      case 'Shipped':
        return <TruckIcon className="w-5 h-5 text-blue-400" />;
      case 'Delivered':
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      default:
        return <ShoppingBagIcon className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <ShoppingBagIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Manage Orders</h2>
        </div>

        {error && (
          <div className="bg-red-500/10 border-l-4 border-red-500 text-red-300 p-4 mb-6 rounded-xl animate-pulse">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 text-blue-500 animate-spin">
                <ArrowPathIcon />
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBagIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">No orders available</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:bg-slate-800/70 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                        <ShoppingBagIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Order #{order.orderId}</h3>
                        <div className="flex items-center space-x-2 text-slate-400 text-sm">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2 text-slate-300">
                        <UserIcon className="w-5 h-5 text-slate-400" />
                        <span>{order.userId}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-300">
                        <CurrencyDollarIcon className="w-5 h-5 text-slate-400" />
                        <span>{order.currency} {order.total.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.orderId, e.target.value as Order['status'])}
                          disabled={loading}
                          className="bg-slate-700/50 border border-slate-600 text-slate-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {['Pending', 'Shipped', 'Delivered'].map((status) => (
                            <option key={status} value={status} className="bg-slate-800">
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpand(order.orderId)}
                    className="p-2 text-slate-400 hover:text-white transition-colors duration-200"
                    aria-label={expandedOrder === order.orderId ? 'Collapse order details' : 'Expand order details'}
                  >
                    {expandedOrder === order.orderId ? (
                      <ChevronUpIcon className="w-5 h-5" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {expandedOrder === order.orderId && (
                  <div className="mt-6 border-t border-slate-700 pt-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-white font-medium mb-4">Order Items</h4>
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                                  <ShoppingBagIcon className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                  <p className="text-white font-medium">{item.name}</p>
                                  <p className="text-slate-400 text-sm">
                                    {item.quantity} × {order.currency} {item.price.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <span className="text-blue-400 font-semibold">
                                {order.currency} {item.subtotal.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-medium mb-4">Shipping Address</h4>
                        <div className="p-3 bg-slate-700/50 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <MapPinIcon className="w-5 h-5 text-slate-400 mt-1" />
                            <div className="text-slate-300">
                              <p className="font-medium">{order.shippingAddress.fullName}</p>
                              <p>{order.shippingAddress.addressLine1}</p>
                              {order.shippingAddress.addressLine2 && (
                                <p>{order.shippingAddress.addressLine2}</p>
                              )}
                              <p>
                                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                                {order.shippingAddress.postalCode}
                              </p>
                              <p>{order.shippingAddress.country}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;