import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, CubeIcon, ShoppingCartIcon, UsersIcon } from '@heroicons/react/24/outline';

const AdminNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all duration-300"
        onClick={toggleSidebar}
      >
        {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
      </button>
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-gray-800 text-white p-6 transform transition-all duration-500 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:shadow-lg lg:rounded-r-2xl`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-white">Admin Panel</h2>
          <button
            className="lg:hidden text-white focus:outline-none"
            onClick={toggleSidebar}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex flex-col space-y-3">
          <Link
            to="/admin/products"
            className={`flex items-center py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
              isActive('/admin/products')
                ? 'bg-blue-600 text-white'
                : 'text-gray-200 hover:bg-gray-700 hover:text-white'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <CubeIcon className="h-5 w-5 mr-3" />
            Manage Products
          </Link>
          <Link
            to="/admin/orders"
            className={`flex items-center py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
              isActive('/admin/orders')
                ? 'bg-blue-600 text-white'
                : 'text-gray-200 hover:bg-gray-700 hover:text-white'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <ShoppingCartIcon className="h-5 w-5 mr-3" />
            Manage Orders
          </Link>
          <Link
            to="/admin/customers"
            className={`flex items-center py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
              isActive('/admin/customers')
                ? 'bg-blue-600 text-white'
                : 'text-gray-200 hover:bg-gray-700 hover:text-white'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <UsersIcon className="h-5 w-5 mr-3" />
            Customer Info
          </Link>
        </nav>
      </aside>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default AdminNav;