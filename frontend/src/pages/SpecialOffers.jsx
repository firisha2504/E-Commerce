import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Clock, Star, ShoppingCart, Calendar, Gift, Percent } from 'lucide-react';

const SpecialOffers = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = () => {
    try {
      const savedOffers = JSON.parse(localStorage.getItem('specialOffers') || '[]');
      
      // Filter only active and non-expired offers for customers
      const activeOffers = savedOffers.filter(offer => 
        offer.status === 'active' && new Date(offer.validUntil) >= new Date()
      );
      
      setOffers(activeOffers);
    } catch (error) {
      console.error('Failed to load offers:', error);
      setOffers([]);
    }
  };

  const getDiscountDisplay = (offer) => {
    if (offer.discountType === 'percentage') {
      return `${offer.discountValue}% OFF`;
    } else if (offer.discountType === 'fixed') {
      return `ETB ${offer.discountValue} OFF`;
    } else if (offer.discountType === 'free_item') {
      return 'Free Item';
    } else if (offer.discountType === 'buy_x_get_y') {
      return `Buy ${Math.floor(offer.discountValue)} Get 1`;
    } else {
      return offer.discountValue;
    }
  };

  const getImageSrc = (imageSrc) => {
    // If it's a localStorage key, retrieve the actual image data
    if (imageSrc && imageSrc.startsWith('special_offer_image_')) {
      const storedImage = localStorage.getItem(imageSrc);
      return storedImage || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800';
    }
    // If it's a URL or empty, return as is or default
    return imageSrc || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800';
  };

  const getColorClasses = (category) => {
    const colorMap = {
      'Weekend Deal': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      'New Customer': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'Lunch Special': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'Family Deal': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'Beverage Deal': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'Birthday Offer': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
      'Holiday Special': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'General': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    };
    return colorMap[category] || colorMap['General'];
  };

  return (
    <div className="min-h-screen bg-light-theme dark:bg-dark-theme py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-accent-900/30 rounded-full mb-4">
            <Tag className="text-primary-600 dark:text-accent-400" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Special Offers & Deals
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Don't miss out on our exclusive deals and special promotions. Save more while enjoying authentic Ethiopian cuisine!
          </p>
        </div>

        {/* Featured Offer Banner */}
        <div className="mb-8 bg-gradient-to-r from-primary-600 to-orange-600 dark:from-accent-600 dark:to-accent-700 rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 md:p-7">
            <div className="flex flex-col justify-center text-white">
              <div className="inline-flex items-center space-x-2 mb-2">
                <Gift size={16} />
                <span className="text-xs font-semibold uppercase tracking-wide">Limited Time Offer</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">
                Grand Opening Special
              </h2>
              <p className="text-sm mb-4 text-white/90">
                Celebrate with us! Get 25% off on all orders this month. Use code: GRAND25
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/products?promo=GRAND25"
                  className="bg-white text-primary-600 dark:text-accent-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center text-sm"
                >
                  Order Now
                  <ShoppingCart className="ml-2" size={16} />
                </Link>
                <div className="flex items-center space-x-2 text-white/90 text-sm">
                  <Clock size={16} />
                  <span>Valid until end of month</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-5 border-2 border-white/30">
                  <div className="text-center">
                    <Percent className="mx-auto mb-2" size={36} />
                    <div className="text-4xl font-bold mb-1">25%</div>
                    <div className="text-base">OFF</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white dark:bg-dark-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={getImageSrc(offer.image)}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getColorClasses(offer.category)}`}>
                    {offer.category}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="bg-white dark:bg-dark-800 px-4 py-2 rounded-lg shadow-lg">
                    <span className="text-primary-600 dark:text-accent-400 font-bold text-lg">
                      {getDiscountDisplay(offer)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {offer.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {offer.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar size={16} className="mr-2" />
                    Valid until {new Date(offer.validUntil).toLocaleDateString()}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Promo Code:</span>
                    <code className="bg-gray-100 dark:bg-dark-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded font-mono text-xs">
                      {offer.promoCode}
                    </code>
                  </div>
                  {offer.minOrderAmount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Min Order:</span>
                      <span className="text-gray-900 dark:text-gray-100">ETB {offer.minOrderAmount}</span>
                    </div>
                  )}
                </div>

                <Link
                  to={`/products?promo=${offer.promoCode}`}
                  className="w-full bg-primary-600 dark:bg-accent-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 dark:hover:bg-accent-600 transition-colors flex items-center justify-center"
                >
                  Order Now
                  <ShoppingCart className="ml-2" size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Offers Message */}
        {offers.length === 0 && (
          <div className="text-center py-12">
            <Tag className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Active Offers
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Check back soon for exciting special offers and deals!
            </p>
          </div>
        )}

        {/* How to Redeem Section */}
        <div className="mt-16 bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
            How to Redeem Your Offers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-accent-900/30 rounded-full mb-4">
                <ShoppingCart className="text-primary-600 dark:text-accent-400" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                1. Browse & Select
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose your favorite dishes from our menu and add them to your cart
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-accent-900/30 rounded-full mb-4">
                <Tag className="text-primary-600 dark:text-accent-400" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                2. Apply Code
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Enter the promo code at checkout to apply your discount
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-accent-900/30 rounded-full mb-4">
                <Star className="text-primary-600 dark:text-accent-400" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                3. Enjoy Savings
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Complete your order and enjoy delicious food at a great price
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 bg-gradient-to-r from-primary-500 to-orange-600 dark:from-accent-500 dark:to-accent-700 rounded-2xl shadow-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Never Miss a Deal!
          </h2>
          <p className="mb-6 text-white/90">
            Subscribe to our newsletter and be the first to know about exclusive offers and promotions
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-primary-600 dark:text-accent-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffers;
