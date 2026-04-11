import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  LogOut, 
  Settings,
  Package,
  Heart,
  Search
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useLogo } from '../../contexts/LogoContext';
import ThemeToggle from '../common/ThemeToggle';
import NotificationCenter from '../common/NotificationCenter';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();
  const { logoUrl } = useLogo();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  // Helper function to check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar-glass sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl shadow-lg group-hover:shadow-glow dark:group-hover:shadow-glow-cyan transition-all duration-300 overflow-hidden">
              <img 
                src={logoUrl} 
                alt="FA Restaurant Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to text logo if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-primary-600 dark:bg-accent-500 rounded-xl hidden items-center justify-center">
                <span className="text-white font-bold text-lg">FA</span>
              </div>
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary-500 dark:group-hover:text-accent-400 transition-colors duration-200">
              FA Restaurant
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-primary-600 dark:text-accent-400 border-b-2 border-primary-600 dark:border-accent-400 pb-1' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-accent-400'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`font-medium transition-colors duration-200 ${
                isActive('/products') || location.pathname.startsWith('/products/')
                  ? 'text-primary-600 dark:text-accent-400 border-b-2 border-primary-600 dark:border-accent-400 pb-1' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-accent-400'
              }`}
            >
              Menu
            </Link>
            <Link 
              to="/special-offers" 
              className={`font-medium transition-colors duration-200 ${
                isActive('/special-offers') 
                  ? 'text-primary-600 dark:text-accent-400 border-b-2 border-primary-600 dark:border-accent-400 pb-1' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-accent-400'
              }`}
            >
              Special Offers
            </Link>
            <Link 
              to="/about" 
              className={`font-medium transition-colors duration-200 ${
                isActive('/about') 
                  ? 'text-primary-600 dark:text-accent-400 border-b-2 border-primary-600 dark:border-accent-400 pb-1' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-accent-400'
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`font-medium transition-colors duration-200 ${
                isActive('/contact') 
                  ? 'text-primary-600 dark:text-accent-400 border-b-2 border-primary-600 dark:border-accent-400 pb-1' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-accent-400'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <button 
                onClick={() => {
                  const searchInput = document.getElementById('navbar-search');
                  if (searchInput) {
                    searchInput.classList.toggle('hidden');
                    searchInput.focus();
                  }
                }}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-accent-400 transition-colors duration-200"
              >
                <Search size={20} />
              </button>
              
              {/* Search Input */}
              <div id="navbar-search" className="hidden absolute right-0 top-full mt-2 w-64 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700 p-2 z-50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 bg-transparent border-none focus:outline-none text-gray-900 dark:text-gray-100"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const searchTerm = e.target.value;
                        if (searchTerm.trim()) {
                          window.location.href = `/products?search=${encodeURIComponent(searchTerm)}`;
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            {isAuthenticated && <NotificationCenter />}

            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-accent-400 transition-colors duration-200"
            >
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 dark:bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors duration-200"
                >
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary-500 dark:border-accent-500"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 dark:from-accent-500 dark:to-accent-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <span className="hidden sm:block text-gray-700 dark:text-gray-300 font-medium">
                    {user?.name || 'User'}
                  </span>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-200 dark:border-dark-700 py-2 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User size={16} className="mr-3" />
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package size={16} className="mr-3" />
                      Orders
                    </Link>
                    <Link
                      to="/favorites"
                      className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Heart size={16} className="mr-3" />
                      Favorites
                    </Link>
                    {user?.isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings size={16} className="mr-3" />
                        Admin Panel
                      </Link>
                    )}
                    <hr className="my-2 border-gray-200 dark:border-dark-700" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                    >
                      <LogOut size={16} className="mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-accent-400 transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-500 dark:bg-accent-500 text-white px-4 py-2 text-sm rounded-lg hover:bg-primary-600 dark:hover:bg-accent-600 transition-colors shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-accent-400 transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-dark-700">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className={`font-medium py-2 transition-colors duration-200 ${
                  isActive('/') 
                    ? 'text-primary-600 dark:text-accent-400 bg-primary-50 dark:bg-accent-900/20 px-4 rounded-lg' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-accent-400'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className={`font-medium py-2 transition-colors duration-200 ${
                  isActive('/products') || location.pathname.startsWith('/products/')
                    ? 'text-primary-600 dark:text-accent-400 bg-primary-50 dark:bg-accent-900/20 px-4 rounded-lg' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-accent-400'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Menu
              </Link>
              <Link 
                to="/special-offers" 
                className={`font-medium py-2 transition-colors duration-200 ${
                  isActive('/special-offers') 
                    ? 'text-primary-600 dark:text-accent-400 bg-primary-50 dark:bg-accent-900/20 px-4 rounded-lg' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-accent-400'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Special Offers
              </Link>
              <Link 
                to="/about" 
                className={`font-medium py-2 transition-colors duration-200 ${
                  isActive('/about') 
                    ? 'text-primary-600 dark:text-accent-400 bg-primary-50 dark:bg-accent-900/20 px-4 rounded-lg' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-accent-400'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className={`font-medium py-2 transition-colors duration-200 ${
                  isActive('/contact') 
                    ? 'text-primary-600 dark:text-accent-400 bg-primary-50 dark:bg-accent-900/20 px-4 rounded-lg' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-accent-400'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;