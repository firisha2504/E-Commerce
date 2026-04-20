import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, CheckCircle, Tag, Gift, Heart } from 'lucide-react';
import { productsAPI } from '../services/api';
import ProductImage from '../components/common/ProductImage';
import Modal from '../components/common/Modal';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [searchParams] = useSearchParams();
  const [detectedOffer, setDetectedOffer] = useState(null);
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();

  // Debounce search — only update debouncedSearch 400ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Detect promo code from URL
  useEffect(() => {
    const urlPromoCode = searchParams.get('promo');
    if (urlPromoCode) {
      try {
        const savedOffers = JSON.parse(localStorage.getItem('specialOffers') || '[]');
        const offer = savedOffers.find(o => 
          o.promoCode.toUpperCase() === urlPromoCode.toUpperCase() && 
          o.status === 'active' && 
          new Date(o.validUntil) >= new Date()
        );
        
        if (offer) {
          setDetectedOffer(offer);
        }
      } catch (error) {
        console.error('Failed to detect promo code:', error);
      }
    }
  }, [searchParams]);

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products', { search: searchTerm, category: selectedCategory }],
    queryFn: async () => {
      const response = await productsAPI.getAll({ search: searchTerm, category: selectedCategory });
      return response.data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await productsAPI.getCategories();
      return response.data;
    },
    onError: (error) => {
      console.error('Failed to fetch categories:', error);
    }
  });

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    if (detectedOffer) {
      setModalMessage(`${product.name} added to cart! 🎉 Your ${detectedOffer.promoCode} discount will be applied at checkout.`);
    } else {
      setModalMessage(`${product.name} added to cart!`);
    }
    setShowModal(true);
  };

  if (productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 dark:border-accent-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-theme dark:bg-dark-theme py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Our Menu</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover authentic Ethiopian cuisine made with love and tradition
          </p>
        </div>

        {/* Promo Code Banner */}
        {detectedOffer && (
          <div className="mb-8 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 rounded-full p-3">
                  <Gift size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{detectedOffer.title}</h3>
                  <p className="text-green-100">{detectedOffer.description}</p>
                  <p className="text-sm text-green-200 mt-1">
                    Code: <span className="font-mono bg-white/20 px-2 py-1 rounded">{detectedOffer.promoCode}</span>
                    {detectedOffer.minOrderAmount > 0 && ` • Min order: $${detectedOffer.minOrderAmount}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {detectedOffer.discountType === 'percentage' 
                    ? `${detectedOffer.discountValue}% OFF`
                    : `$${detectedOffer.discountValue} OFF`
                  }
                </div>
                <p className="text-sm text-green-200 mt-1">
                  Add items to cart below ⬇️
                </p>
                <p className="text-xs text-green-300 mt-1">
                  Discount applies automatically at checkout
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-12 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100 min-w-48"
            >
              <option value="">All Categories</option>
              {categories?.categories?.map((category) => {
                const categoryName = typeof category === 'string' ? category : category?.name || 'Unknown';
                const categoryValue = typeof category === 'string' ? category : category?.name || category?.id || 'unknown';
                return (
                  <option key={category.id || categoryName} value={categoryValue}>
                    {categoryName}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products?.products?.map((product) => (
            <div 
              key={product.id} 
              className="product-card group bg-white dark:bg-dark-800 rounded-2xl shadow-lg hover:shadow-2xl hover-lift transition-all duration-500 overflow-hidden border border-gray-100 dark:border-dark-600 hover:border-primary-200 dark:hover:border-accent-400/30 hover-glow"
            >
              <div className="relative overflow-hidden h-44">
                <ProductImage
                  src={product.imageUrl}
                  alt={product.name}
                  productName={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-primary-600 dark:bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg transform translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
                  ETB {product.price}
                </div>
                
                {/* Favorite Button */}
                <button
                  onClick={() => {
                    if (!isAuthenticated) { toast.error('Please login to save favorites'); return; }
                    const added = toggleFavorite(product);
                    toast.success(added ? `${product.name} added to favorites!` : `${product.name} removed from favorites`);
                  }}
                  className="absolute top-4 left-4 bg-white/90 dark:bg-dark-800/90 p-2 rounded-full shadow-lg transform -translate-x-12 group-hover:translate-x-0 transition-all duration-500 hover:scale-110"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${isFavorite(product.id) ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-400'}`}
                  />
                </button>
                
                {/* Quick Actions */}
                <div className="absolute bottom-4 left-4 right-4 flex space-x-2 transform translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-primary-600 dark:bg-accent-500 text-white py-2 px-4 rounded-lg hover:bg-primary-700 dark:hover:bg-accent-600 transition-colors text-sm font-medium shadow-lg"
                  >
                    Add to Cart
                  </button>
                  <Link
                    to={`/products/${product.id}`}
                    className="bg-white dark:bg-dark-800 text-primary-600 dark:text-accent-400 py-2 px-4 rounded-lg hover:bg-primary-50 dark:hover:bg-accent-900/20 transition-colors text-sm font-medium shadow-lg"
                  >
                    Details
                  </Link>
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-accent-400 transition-colors duration-300 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
                
                {/* Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      (4.0)
                    </span>
                  </div>
                  
                  {/* Category Badge */}
                  <span className="text-xs bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                    {(() => {
                      if (!product.category) return 'Food';
                      if (typeof product.category === 'string') return product.category;
                      if (typeof product.category === 'object' && product.category.name) return product.category.name;
                      return 'Food';
                    })()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {products?.products?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </div>
      
      {/* Success Modal */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title="Success"
      >
        <div className="flex items-center space-x-3">
          <CheckCircle className="text-green-500" size={24} />
          <p className="text-gray-900 dark:text-gray-100">{modalMessage}</p>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowModal(false)}
            className="bg-primary-600 dark:bg-accent-500 text-white px-6 py-2 rounded-lg hover:bg-primary-700 dark:hover:bg-accent-600 transition-colors"
          >
            OK
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Products;