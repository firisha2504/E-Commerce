import React from 'react';
import { Coffee, Users, Award, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-light-theme dark:bg-dark-theme py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About FA Restaurant</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience the authentic taste of Ethiopia with our traditional recipes passed down through generations.
          </p>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2023, FA Restaurant was born from a passion for sharing the rich culinary heritage of Ethiopia with the world. 
                Our founder, Fikadu, grew up learning traditional recipes from his grandmother in Addis Ababa.
              </p>
              <p className="text-gray-600 mb-4">
                What started as a small family kitchen has grown into a beloved restaurant that brings people together through food, 
                culture, and community.
              </p>
              <p className="text-gray-600">
                Every dish we serve tells a story - from the aromatic spices to the traditional cooking methods that have been 
                perfected over centuries.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-500 to-orange-600 rounded-2xl h-64 w-full"></div>
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-xl w-4/5">
                <div className="flex items-center space-x-4">
                  <Coffee className="text-primary-500" size={32} />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">Traditional Coffee</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Authentic Ethiopian coffee ceremony</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-lg text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-accent-900/30 rounded-full mb-4">
                <Heart className="text-primary-500 dark:text-accent-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Authenticity</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We stay true to traditional recipes and cooking methods, ensuring every dish is authentic.
              </p>
            </div>
            
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-lg text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-accent-900/30 rounded-full mb-4">
                <Users className="text-primary-500 dark:text-accent-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Community</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Food brings people together. We're committed to building a welcoming community around our restaurant.
              </p>
            </div>
            
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-lg text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-accent-900/30 rounded-full mb-4">
                <Award className="text-primary-500 dark:text-accent-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Quality</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We source the finest ingredients and prepare each dish with care and attention to detail.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-orange-600 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fikadu A.</h3>
              <p className="text-primary-500 dark:text-accent-400 font-medium mb-2">Founder & Head Chef</p>
              <p className="text-gray-600 text-sm">
                With over 20 years of experience in Ethiopian cuisine, Fikadu brings traditional flavors to life.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-orange-600 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Selam T.</h3>
              <p className="text-primary-500 dark:text-accent-400 font-medium mb-2">Pastry Chef</p>
              <p className="text-gray-600 text-sm">
                Specializing in traditional Ethiopian breads and desserts, Selam creates authentic baked goods.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-orange-600 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mekonnen B.</h3>
              <p className="text-primary-500 dark:text-accent-400 font-medium mb-2">Coffee Master</p>
              <p className="text-gray-600 text-sm">
                Mekonnen performs the traditional coffee ceremony, bringing authentic Ethiopian coffee culture to our guests.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-primary-500 to-orange-600 dark:from-accent-500 dark:to-accent-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Visit Us Today</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Experience the warmth of Ethiopian hospitality and the rich flavors of our traditional cuisine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-primary-600 dark:text-accent-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Get Directions
            </a>
            <a
              href="/reservations"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Make a Reservation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;