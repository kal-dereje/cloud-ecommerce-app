import React, { useEffect, useState } from 'react';
import { mockGetCustomers } from '../mocks/mock';
import { 
  UserGroupIcon, 
  EnvelopeIcon, 
  ShoppingBagIcon,
  ArrowPathIcon,
  UserIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface Customer {
  id: string;
  email: string;
  orderCount: number;
}

const CustomerInfo: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await mockGetCustomers();
        setCustomers(res.data);
      } catch (error) {
        console.error("Failed to fetch customers", error);
        setError('Failed to load customers. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <UserGroupIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Customer Info</h2>
        </div>

        {error && (
          <div className="bg-red-500/10 border-l-4 border-red-500 text-red-300 p-4 mb-6 rounded-xl animate-pulse">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center items-center h-64">
              <div className="w-8 h-8 text-blue-500 animate-spin">
                <ArrowPathIcon />
              </div>
            </div>
          ) : customers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <UserGroupIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">No customers available</p>
            </div>
          ) : (
            customers.map((customer) => (
              <div
                key={customer.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:bg-slate-800/70 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium">{customer.email}</h3>
                      <div className="flex items-center space-x-2">
                        <ShoppingBagIcon className="w-5 h-5 text-blue-400" />
                        <span className="text-blue-400 font-semibold">{customer.orderCount}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-400 text-sm">
                      <EnvelopeIcon className="w-4 h-4" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Order History</span>
                        <button
                          className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700/70 transition-colors duration-200 flex items-center space-x-1"
                          aria-label="View order history"
                        >
                          <ChartBarIcon className="w-4 h-4" />
                          <span>View</span>
                        </button>
                      </div>
                      <div className="mt-2 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                          style={{ width: `${Math.min((customer.orderCount / 10) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;