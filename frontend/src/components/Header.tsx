import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { ShoppingCartIcon, UserIcon, ChevronDownIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { cartAtom } from '../atoms/cartAtom';
import { userAtom } from '../atoms/userAtoms';
import API from '../api';

const Header: React.FC = () => {
  const [cart] = useAtom(cartAtom);
  const [user, setUser] = useAtom(userAtom);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      //await API.post('/auth/logout');
      setUser(null);
      setIsDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 animate-fade-in">
      <div className="container mx-auto flex justify-between items-center p-6">
        <Link
          to="/"
          className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-300"
        >
          ShopExpress
        </Link>
        <nav className="flex items-center space-x-6">
          <Link
            to="/products"
            className="text-gray-600 hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            Products
          </Link>
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              <ChartBarIcon className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          )}
          {user && user.role !== 'admin' && (
            <Link
              to="/admin"
              className="text-gray-600 hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Orders
            </Link>
          )}
          <Link to="/cart" className="relative group">
            <ShoppingCartIcon className="h-7 w-7 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-6 h-6 flex items-center justify-center animate-pulse">
                {cart.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            )}
          </Link>
          {user ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all duration-300"
              >
                <UserIcon className="h-7 w-7" />
                <span className="text-sm font-medium">{user.email}</span>
                <ChevronDownIcon
                  className={`h-5 w-5 transform transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl transition-all duration-300 transform ${
                  isDropdownOpen
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-2 pointer-events-none'
                } z-50`}
              >
                <div className="py-2">
                  {user.role !== 'admin' && (
                    <Link
                      to="/orders"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    >
                      Order History
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;