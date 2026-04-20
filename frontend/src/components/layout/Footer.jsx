import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useLogo } from '../../contexts/LogoContext';

const Footer = () => {
  const { logoUrl } = useLogo();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg overflow-hidden shadow-lg">
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt="FA Restaurant Logo" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-full h-full bg-primary-600 dark:bg-accent-500 rounded-lg ${logoUrl ? 'hidden' : 'flex'} items-center justify-center`}>
                  <span className="text-white font-bold text-sm">FA</span>
                </div>
              </div>
              <span className="text-xl font-bold">FA Restaurant</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Authentic Ethiopian cuisine delivered fresh to your doorstep. 
              Experience traditional flavors with modern convenience.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-primary-500 dark:text-accent-400" />
                <span className="text-gray-300">+251 911 123 456</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-primary-500 dark:text-accent-400" />
                <span className="text-gray-300">info@farestaurant.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-primary-500 dark:text-accent-400" />
                <span className="text-gray-300">Dire Dawa, Ethiopia</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary-500 dark:hover:text-accent-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-primary-500 dark:hover:text-accent-400 transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-300 hover:text-primary-500 dark:hover:text-accent-400 transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-primary-500 dark:hover:text-accent-400 transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-primary-500 dark:text-accent-400" />
                <span className="text-gray-300">Mon - Fri: 8:00 AM - 10:00 PM</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-primary-500 dark:text-accent-400" />
                <span className="text-gray-300">Sat - Sun: 9:00 AM - 11:00 PM</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Delivery Areas</h4>
              <p className="text-gray-300 text-sm">
                We deliver to all areas within Dire Dawa. 
                Delivery time: 30-45 minutes.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-300 text-sm">
            © 2024 FA Restaurant. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-300 hover:text-primary-500 dark:hover:text-accent-400 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-300 hover:text-primary-500 dark:hover:text-accent-400 text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-primary-500 dark:hover:text-accent-400 text-sm transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;