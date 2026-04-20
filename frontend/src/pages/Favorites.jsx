import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart } from '../contexts/CartContext';
import ProductImage from '../components/common/ProductImage';
import toast from 'react-hot-toast';

const Favorites = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleRemove = (product) => {
    toggleFavorite(product);
    toast.success(`${product.name} removed from favorites`);
  };

  return (
    <div className="min-h-screen bg-light-theme dark:bg-dark-theme py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <Heart className="text-red-500 fill-red-500" size={28} />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Favorites</h1>
          {favorites.length > 0 && (
            <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {favorites.length}
            </span>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-20 h-20 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No favorites yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Browse the menu and click the heart icon to save your favorite dishes.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-primary-600 dark:bg-accent-500 text-white font-medium rounded-lg hover:bg-primary-700 dark:hover:bg-accent-600 transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map(product => (
              <div key={product.id} className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-dark-600 group">
                <div className="relative h-44 overflow-hidden">
                  <ProductImage
                    src={product.imageUrl}
                    alt={product.name}
                    productName={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(product)}
                    className="absolute top-3 right-3 bg-white dark:bg-dark-800 p-2 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Remove from favorites"
                  >
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  </button>
                  {/* Price badge */}
                  <div className="absolute bottom-3 left-3 bg-primary-600 dark:bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    ETB {product.price}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{product.description}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 flex items-center justify-center gap-2 bg-primary-600 dark:bg-accent-500 text-white py-2 rounded-lg hover:bg-primary-700 dark:hover:bg-accent-600 transition-colors text-sm font-medium"
                    >
                      <ShoppingCart size={15} />
                      Add to Cart
                    </button>
                    <Link
                      to={`/products/${product.id}`}
                      className="px-3 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors text-sm"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
