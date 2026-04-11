import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Clock, Star, ShoppingCart, Calendar, Gift, Percent } from 'lucide-react';

const SpecialOffers = () => {
  const offers = [
    {
      id: 1,
      title: 'Weekend Special',
      description: 'Get 15% off on all orders every Saturday and Sunday',
      discount: '15% OFF',
      validUntil: 'Every Weekend',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      category: 'Weekend Deal',
      color: 'orange'
    },
    {
      id: 2,
      title: 'Lunch Combo Deal',
      description: 'Special lunch combo with main dish, side, and drink for only ETB 250',
      discount: 'ETB 250',
      validUntil: 'Mon-Fri, 11AM-3PM',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
      category: 'Lunch Special',
      color: 'green'
    },
    {
      id: 3,
      title: 'Family Feast',
      description: 'Order for 4 or more and get a free dessert platter',
      discount: 'Free Dessert',
      validUntil: 'Valid All Week',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
      category: 'Family Deal',
      color: 'blue'
    },
    {
      id: 4,
      title: 'First Order Discount',
      description: 'New customers get 20% off their first order',
      discount: '20% OFF',
      validUntil: 'One-time Use',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
      category: 'New Customer',
      color: 'purple'
    },
    {
      id: 5,
      title: 'Coffee Lover Special',
      description: 'Buy 2 Ethiopian coffees, get 1 free',
      discount: 'Buy 2 Get 1',
      validUntil: 'Daily 2PM-5PM',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
      category: 'Beverage Deal',
      color: 'yellow'
    },
    {
      id: 6,
      title: 'Birthday Special',
      description: 'Celebrate your birthday with us and get a free cake',
      discount: 'Free Cake',
      validUntil: 'On Your Birthday',
      image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800',
      category: 'Birthday Offer',
      color: 'pink'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400'
    };
    return colors[color] || colors.orange;
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
        <div className="mb-12 bg-gradient-to-r from-primary-600 to-orange-600 dark:from-accent-600 dark:to-accent-700 rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
            <div className="flex flex-col justify-center text-white">
              <div className="inline-flex items-center space-x-2 mb-4">
                <Gift size={24} />
                <span className="text-sm font-semibold uppercase tracking-wide">Limited Time Offer</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Grand Opening Special
              </h2>
              <p className="text-lg mb-6 text-white/90">
                Celebrate with us! Get 25% off on all orders this month. Use code: GRAND25
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="bg-white text-primary-600 dark:text-accent-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
                >
                  Order Now
                  <ShoppingCart className="ml-2" size={20} />
                </Link>
                <div className="flex items-center space-x-2 text-white/90">
                  <Clock size={20} />
                  <span>Valid until end of month</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30">
                  <div className="text-center">
                    <Percent className="mx-auto mb-4" size={64} />
                    <div className="text-6xl font-bold mb-2">25%</div>
                    <div className="text-xl">OFF</div>
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
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getColorClasses(offer.color)}`}>
                    {offer.category}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="bg-white dark:bg-dark-800 px-4 py-2 rounded-lg shadow-lg">
                    <span className="text-primary-600 dark:text-accent-400 font-bold text-lg">
                      {offer.discount}
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
                    {offer.validUntil}
                  </div>
                </div>

                <Link
                  to="/products"
                  className="w-full bg-primary-600 dark:bg-accent-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 dark:hover:bg-accent-600 transition-colors flex items-center justify-center"
                >
                  Order Now
                  <ShoppingCart className="ml-2" size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>

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
