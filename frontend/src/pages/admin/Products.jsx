import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Camera, Save } from 'lucide-react';
import DashboardLayout from '../../components/admin/DashboardLayout';
import Modal from '../../components/common/Modal';

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Main Course',
    price: '',
    stock: '',
    description: '',
    image: null
  });

  // Mock data - replace with real API calls
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Doro Wot',
      category: 'Main Course',
      price: 450,
      stock: 25,
      status: 'active',
      image: '/images/products/placeholder-food.jpg',
      description: 'Traditional Ethiopian chicken stew with berbere spice'
    },
    {
      id: 2,
      name: 'Injera',
      category: 'Bread',
      price: 50,
      stock: 100,
      status: 'active',
      image: '/images/products/placeholder-food.jpg',
      description: 'Traditional Ethiopian sourdough flatbread'
    },
    {
      id: 3,
      name: 'Ethiopian Coffee',
      category: 'Beverages',
      price: 80,
      stock: 15,
      status: 'low_stock',
      image: '/images/products/placeholder-food.jpg',
      description: 'Premium Ethiopian coffee beans'
    }
  ]);

  const categories = ['all', 'Main Course', 'Appetizers', 'Beverages', 'Desserts', 'Bread'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'out_of_stock': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleAddProduct = () => {
    setNewProduct({
      name: '',
      category: 'Main Course',
      price: '',
      stock: '',
      description: '',
      image: null
    });
    setShowAddModal(true);
  };

  const handleSubmitProduct = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      setErrorMessage('Please fill in all required fields');
      setShowErrorModal(true);
      return;
    }
    
    // Create new product object
    const productToAdd = {
      id: products.length + 1,
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      status: parseInt(newProduct.stock) > 10 ? 'active' : 'low_stock',
      image: '/images/products/placeholder-food.jpg', // Default image
      description: newProduct.description
    };
    
    // Add to products list
    setProducts([...products, productToAdd]);
    
    // Close modal and reset form
    setShowAddModal(false);
    setNewProduct({
      name: '',
      category: 'Main Course',
      price: '',
      stock: '',
      description: '',
      image: null
    });
  };

  const handleInputChange = (field, value) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
      image: null
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      setErrorMessage('Please fill in all required fields');
      setShowErrorModal(true);
      return;
    }
    
    // Update product in the list
    const updatedProducts = products.map(p => 
      p.id === productToEdit.id 
        ? {
            ...p,
            name: newProduct.name,
            category: newProduct.category,
            price: parseFloat(newProduct.price),
            stock: parseInt(newProduct.stock),
            status: parseInt(newProduct.stock) > 10 ? 'active' : 'low_stock',
            description: newProduct.description
          }
        : p
    );
    
    setProducts(updatedProducts);
    setShowEditModal(false);
    setProductToEdit(null);
    setNewProduct({
      name: '',
      category: 'Main Course',
      price: '',
      stock: '',
      description: '',
      image: null
    });
  };

  const handleDeleteProduct = (productId) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  };

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete));
      setProductToDelete(null);
    }
    setShowDeleteModal(false);
  };

  const actions = (
    <button 
      onClick={handleAddProduct}
      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
    >
      <Plus size={20} />
      <span>Add Product</span>
    </button>
  );

  return (
    <DashboardLayout title="Products Management" actions={actions}>
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 w-full sm:w-64"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 pr-10 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 min-w-48"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
              <thead className="bg-gray-50 dark:bg-dark-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={product.image}
                          alt={product.name}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ETB {product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                        {product.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleViewProduct(product)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors duration-200" 
                          title="Edit Product"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No products found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <Modal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        title="Add New Product"
      >
        <form onSubmit={handleSubmitProduct} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select 
                value={newProduct.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
              >
                <option>Main Course</option>
                <option>Appetizers</option>
                <option>Beverages</option>
                <option>Desserts</option>
                <option>Bread</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price (ETB) *
              </label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => handleInputChange('stock', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={newProduct.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter product description"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product Image
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-200 dark:bg-dark-600 rounded-lg flex items-center justify-center">
                <Camera size={24} className="text-gray-400" />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleInputChange('image', e.target.files[0])}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Add Product</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        title="Edit Product"
      >
        <form onSubmit={handleUpdateProduct} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select 
                value={newProduct.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
              >
                <option>Main Course</option>
                <option>Appetizers</option>
                <option>Beverages</option>
                <option>Desserts</option>
                <option>Bread</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price (ETB) *
              </label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => handleInputChange('stock', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={newProduct.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter product description"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product Image
            </label>
            <div className="flex items-center space-x-4">
              {productToEdit && (
                <img
                  src={productToEdit.image}
                  alt={productToEdit.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleInputChange('image', e.target.files[0])}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Update Product</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* View Product Modal */}
      <Modal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)}
        title="Product Details"
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedProduct.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedProduct.category}</p>
                <p className="text-primary-600 dark:text-accent-400 font-semibold">
                  ETB {selectedProduct.price}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Description</h4>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedProduct.description || 'No description available.'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Stock</h4>
                <p className="text-gray-600 dark:text-gray-400">{selectedProduct.stock} units</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Status</h4>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedProduct.status)}`}>
                  {selectedProduct.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setShowViewModal(false)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Error Modal */}
      <Modal 
        isOpen={showErrorModal} 
        onClose={() => setShowErrorModal(false)}
        title="Validation Error"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            {errorMessage}
          </p>
          <div className="flex justify-end">
            <button
              onClick={() => setShowErrorModal(false)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this product? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteProduct}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default AdminProducts;