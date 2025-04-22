import React from 'react';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-800 to-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="flex items-center space-x-2 hover:text-blue-400 transition-colors duration-200">
                  <HomeIcon className="h-5 w-5" />
                  <span>Home</span>
                </a>
              </li>
              <li>
                <a href="/products" className="flex items-center space-x-2 hover:text-blue-400 transition-colors duration-200">
                  <ShoppingBagIcon className="h-5 w-5" />
                  <span>Products</span>
                </a>
              </li>
              <li>
                <a href="/account" className="flex items-center space-x-2 hover:text-blue-400 transition-colors duration-200">
                  <UserIcon className="h-5 w-5" />
                  <span>My Account</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <EnvelopeIcon className="h-5 w-5 mt-1 flex-shrink-0" />
                <span>support@ecommerce.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <PhoneIcon className="h-5 w-5 mt-1 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 mt-1 flex-shrink-0" />
                <span>123 Commerce St, Suite 100<br />New York, NY 10001</span>
              </li>
            </ul>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="hover:text-blue-400 transition-colors duration-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="/careers" className="hover:text-blue-400 transition-colors duration-200">
                  Careers
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-blue-400 transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-blue-400 transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-slate-300 mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6">
              <a href="#" className="hover:text-blue-400 transition-colors duration-200">
                <ShareIcon className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors duration-200">
                <ShareIcon className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors duration-200">
                <ShareIcon className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors duration-200">
                <ShareIcon className="h-6 w-6" />
              </a>
            </div>
            <p className="text-slate-400">
              © {currentYear} E-Commerce Store. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 