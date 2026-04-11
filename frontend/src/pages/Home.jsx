import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Clock, 
  Truck, 
  Star, 
  ChefHat, 
  Coffee, 
  Utensils,
  ArrowRight,
  Grid,
  List,
  ShoppingCart
} from 'lucide-react';
import { productsAPI } from '../services/api';
import ProductImage from '../components/common/ProductImage';
import { useCart } from '../contexts/CartContext';
import Modal from '../components/common/Modal';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('Featured Foods');
  const [viewMode, setViewMode] = useState('grid');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const { addToCart } = useCart();
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await productsAPI.getCategories();
      return response.data;
    },
  });

  const { data: popularProducts } = useQuery({
    queryKey: ['popular-products', selectedCategory],
    queryFn: async () => {
      const params = selectedCategory === 'Featured Foods' ? {} : { category: selectedCategory };
      const response = await productsAPI.getAll({ ...params, limit: 6 });
      return response.data;
    },
  });

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setModalMessage(`${product.name} added to cart!`);
    setShowModal(true);
  };

  const categoryTabs = ['Featured Foods', 'Cold Drinks', 'Juice Blends', 'Specials'];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="relative bg-gray-900 text-white py-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60" />
        </div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Delicious Meals<br />
              Delivered To Your Door
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Order your favorite Ethiopian dishes and get them delivered fresh and hot to your doorstep.
            </p>
            <Link
              to="/products"
              className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg text-lg"
            >
              Explore Menu
            </Link>
          </div>
        </div>
        
        {/* Promotional Banner */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="bg-primary-600 text-white py-4 px-6 rounded-lg text-center shadow-xl">
            <p className="text-lg font-semibold">
              Order Now & Get 15% Off Your First Order!
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
              <div className="flex flex-wrap gap-2 mb-4 sm:mb-0">
                {categoryTabs.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-600 dark:bg-accent-500 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 bg-gray-100 dark:bg-dark-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-dark-600 text-primary-600 dark:text-accent-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-dark-600 text-primary-600 dark:text-accent-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>

            {/* Products Grid */}
            {popularProducts?.products && popularProducts.products.length > 0 ? (
              <div className={`grid gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {popularProducts.products.map((product) => (
                  <div
                    key={product.id}
                    className={`product-card group bg-white dark:bg-dark-700 rounded-2xl shadow-lg hover:shadow-2xl hover-lift transition-all duration-500 overflow-hidden border border-gray-100 dark:border-dark-600 hover:border-primary-200 dark:hover:border-accent-400/30 hover-glow ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    <div className={`relative overflow-hidden ${
                      viewMode === 'list' ? 'w-64 h-64' : 'w-full h-64'
                    }`}>
                      <ProductImage
                        src={product.imageUrl}
                        alt={product.name}
                        productName={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {/* Gradient Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Price Badge */}
                      <div className="absolute top-4 right-4 bg-primary-600 dark:bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg transform translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
                        ${product.price}
                      </div>
                      
                      {/* Quick Add Button */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="absolute bottom-4 right-4 bg-white dark:bg-dark-800 text-primary-600 dark:text-accent-400 p-3 rounded-full shadow-lg transform translate-y-12 group-hover:translate-y-0 transition-all duration-500 hover:bg-primary-50 dark:hover:bg-accent-900/20"
                      >
                        <ShoppingCart size={20} />
                      </button>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-accent-400 transition-colors duration-300">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center space-x-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                            (4.0)
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/products/${product.id}`}
                            className="text-primary-600 dark:text-accent-400 hover:text-primary-700 dark:hover:text-accent-300 font-medium text-sm transition-colors duration-300"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No products available in this category.</p>
              </div>
            )}
          </div>

          {/* Why Choose Us Section */}
          <div className="text-center mb-12 mt-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Why Choose FA Restaurant?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We're committed to providing you with the best dining experience, 
              whether you're dining in or ordering for delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary-100 dark:bg-accent-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-primary-600 dark:text-accent-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Fast Delivery</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Quick and reliable delivery service. Get your favorite meals 
                delivered hot and fresh within 30-45 minutes.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary-100 dark:bg-accent-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="text-primary-600 dark:text-accent-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Authentic Cuisine</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Traditional Ethiopian recipes prepared by experienced chefs 
                using the finest ingredients and authentic spices.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary-100 dark:bg-accent-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-primary-600 dark:text-accent-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Quality Service</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Exceptional customer service with a focus on quality, 
                freshness, and customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50 dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Our Menu Categories
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Explore our diverse selection of authentic Ethiopian dishes and beverages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-8 text-center">
                <div className="bg-primary-100 dark:bg-accent-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils className="text-primary-600 dark:text-accent-400" size={40} />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Food</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Traditional Ethiopian main dishes, vegetarian options, and delicious snacks. 
                  From injera with various stews to modern fusion dishes.
                </p>
                <Link
                  to="/products?category=food"
                  className="inline-flex items-center text-primary-600 dark:text-accent-400 font-semibold hover:text-primary-700 dark:hover:text-accent-300"
                >
                  Explore Food Menu
                  <ArrowRight className="ml-2" size={16} />
                </Link>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-8 text-center">
                <div className="bg-primary-100 dark:bg-accent-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coffee className="text-primary-600 dark:text-accent-400" size={40} />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Beverages</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Refreshing drinks including traditional Ethiopian coffee, fresh juices, 
                  soft drinks, and specialty beverages to complement your meal.
                </p>
                <Link
                  to="/products?category=beverages"
                  className="inline-flex items-center text-primary-600 dark:text-accent-400 font-semibold hover:text-primary-700 dark:hover:text-accent-300"
                >
                  Explore Beverages
                  <ArrowRight className="ml-2" size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 dark:bg-accent-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Order?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Join thousands of satisfied customers who trust FA Restaurant 
            for their authentic Ethiopian dining experience.
          </p>
          <Link
            to="/products"
            className="bg-white text-primary-600 dark:text-accent-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center shadow-lg"
          >
            Start Ordering
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>

      {/* Success Modal */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title="Success"
      >
        <div className="flex items-center space-x-3">
          <ShoppingCart className="text-green-500" size={24} />
          <p className="text-gray-900 dark:text-gray-100">{modalMessage}</p>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
          >
            Continue Shopping
          </button>
          <Link
            to="/cart"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-primary-600 dark:bg-accent-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-accent-600 transition-colors"
          >
            View Cart
          </Link>
        </div>
      </Modal>
    </div>
  );
};

export default Home;