import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { productsAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import ProductImage from '../components/common/ProductImage';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await productsAPI.getById(id);
      return response.data;
    },
    enabled: !!id,
  });

  // Fetch related products
  const { data: relatedProducts } = useQuery({
    queryKey: ['related-products', product?.category],
    queryFn: async () => {
      const response = await productsAPI.getAll({ 
        category: product?.category,
        limit: 3 
      });
      // Filter out the current product
      return response.data.products?.filter(p => p.id !== parseInt(id)) || [];
    },
    enabled: !!product?.category,
  });

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 dark:border-accent-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Mock images for demonstration
  const productImages = [
    product.imageUrl || '/images/products/placeholder-food.jpg',
    '/images/products/placeholder-food.jpg',
    '/images/products/placeholder-food.jpg',
  ];

  return (
    <div className="min-h-screen bg-light-theme dark:bg-dark-theme py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li>
                <a href="/" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-accent-400">
                  Home
                </a>
              </li>
              <li>
                <span className="mx-2 text-gray-400 dark:text-gray-600">/</span>
              </li>
              <li>
                <a href="/products" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-accent-400">
                  Menu
                </a>
              </li>
              <li>
                <span className="mx-2 text-gray-400 dark:text-gray-600">/</span>
              </li>
              <li aria-current="page">
                <span className="text-gray-900 dark:text-gray-100 font-medium">{product.name}</span>
              </li>
            </ol>
          </nav>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            {/* Main Image */}
            <div className="mb-4">
              <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg overflow-hidden">
                <ProductImage
                  src={productImages[selectedImage]}
                  alt={product.name}
                  productName={product.name}
                  className="w-full h-96 object-cover"
                />
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-4">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? 'border-primary-500 dark:border-accent-500'
                      : 'border-gray-200 dark:border-dark-700'
                  }`}
                >
                  <ProductImage
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    productName={product.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 dark:text-gray-400">(24 reviews)</span>
              </div>
              <p className="text-3xl font-bold text-primary-600 dark:text-accent-400 mb-6">${product.price}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Description</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{product.description}</p>
            </div>

            {/* Product Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-500">Category</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{product.category || 'Main Course'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-500">Spice Level</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Medium</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-500">Preparation Time</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">20-30 minutes</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-500">Serves</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">2-3 people</p>
                </div>
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 dark:border-dark-600 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="px-4 py-2 text-lg font-medium text-gray-900 dark:text-gray-100">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    <p className="text-sm">Available: In Stock</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary-600 dark:bg-accent-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 dark:hover:bg-accent-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart size={20} />
                  <span>Add to Cart</span>
                </button>
                <button className="flex-1 border-2 border-primary-600 dark:border-accent-500 text-primary-600 dark:text-accent-400 py-3 px-6 rounded-lg font-medium hover:bg-primary-50 dark:hover:bg-accent-900/20 transition-colors flex items-center justify-center space-x-2">
                  <Heart size={20} />
                  <span>Add to Favorites</span>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Note:</span> This dish contains nuts and dairy. 
                  Please inform us of any allergies when ordering.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts && relatedProducts.length > 0 ? (
              relatedProducts.slice(0, 3).map((relatedProduct) => (
                <div 
                  key={relatedProduct.id} 
                  className="product-card group bg-white dark:bg-dark-800 rounded-2xl shadow-lg hover:shadow-2xl hover-lift transition-all duration-500 overflow-hidden border border-gray-100 dark:border-dark-600 hover:border-primary-200 dark:hover:border-accent-400/30 hover-glow"
                >
                  <div className="relative overflow-hidden h-48">
                    <ProductImage
                      src={relatedProduct.imageUrl}
                      alt={relatedProduct.name}
                      productName={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-primary-600 dark:bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg transform translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
                      ${relatedProduct.price}
                    </div>
                    
                    {/* Quick Add Button */}
                    <button
                      onClick={() => {
                        addToCart(relatedProduct, 1);
                        // Removed duplicate toast - addToCart handles its own notification in individual pages
                      }}
                      className="absolute bottom-4 right-4 bg-white dark:bg-dark-800 text-primary-600 dark:text-accent-400 p-3 rounded-full shadow-lg transform translate-y-12 group-hover:translate-y-0 transition-all duration-500 hover:bg-primary-50 dark:hover:bg-accent-900/20"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-accent-400 transition-colors duration-300 line-clamp-1">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2 leading-relaxed">
                      {relatedProduct.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          (4.0)
                        </span>
                      </div>
                      
                      <a
                        href={`/products/${relatedProduct.id}`}
                        className="text-primary-600 dark:text-accent-400 hover:text-primary-700 dark:hover:text-accent-300 text-sm font-medium transition-colors duration-300"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback to mock data if no related products found
              [1, 2, 3].map((item) => (
                <div 
                  key={item} 
                  className="product-card group bg-white dark:bg-dark-800 rounded-2xl shadow-lg hover:shadow-2xl hover-lift transition-all duration-500 overflow-hidden border border-gray-100 dark:border-dark-600 hover:border-primary-200 dark:hover:border-accent-400/30 hover-glow"
                >
                  <div className="relative overflow-hidden h-48">
                    <ProductImage
                      src="/images/products/placeholder-food.jpg"
                      alt={`Related Dish ${item}`}
                      productName={`Related Dish ${item}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-primary-600 dark:bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg transform translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
                      $14.99
                    </div>
                    
                    {/* Quick Add Button */}
                    <button
                      onClick={() => {
                        // Simulate adding related dish to cart
                        // In a real app, you would have the actual product data
                        console.log(`Related Dish ${item} would be added to cart`);
                      }}
                      className="absolute bottom-4 right-4 bg-white dark:bg-dark-800 text-primary-600 dark:text-accent-400 p-3 rounded-full shadow-lg transform translate-y-12 group-hover:translate-y-0 transition-all duration-500 hover:bg-primary-50 dark:hover:bg-accent-900/20"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-accent-400 transition-colors duration-300">
                      Related Dish {item}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2 leading-relaxed">
                      Delicious Ethiopian specialty made with traditional ingredients and authentic spices.
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          (4.0)
                        </span>
                      </div>
                      
                      <a
                        href="/products"
                        className="text-primary-600 dark:text-accent-400 hover:text-primary-700 dark:hover:text-accent-300 text-sm font-medium transition-colors duration-300"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;