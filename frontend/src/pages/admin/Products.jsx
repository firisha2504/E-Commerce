import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Camera, Save } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../../components/admin/DashboardLayout';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const emptyForm = {
  name: '',
  category: 'Main Course',
  price: '',
  description: '',
  imageUrl: '',
  imageFile: null,
  isAvailable: true,
};

const CATEGORIES = ['all', 'Main Course', 'Appetizers', 'Beverages', 'Desserts', 'Bread', 'Food'];

// ─── Defined OUTSIDE AdminProducts so it never remounts on state change ───────
const FormFields = ({ form, setForm }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name *</label>
        <input
          type="text"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Product name"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
        <select
          value={form.category}
          onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {CATEGORIES.filter(c => c !== 'all').map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price *</label>
        <input
          type="number"
          value={form.price}
          onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="0.00"
          min="0"
          step="0.01"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
        <select
          value={form.isAvailable ? 'active' : 'inactive'}
          onChange={e => setForm(f => ({ ...f, isAvailable: e.target.value === 'active' }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
      <textarea
        rows={3}
        value={form.description}
        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        placeholder="Product description"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Image</label>
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 bg-gray-100 dark:bg-dark-600 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
          {form.imageFile instanceof File ? (
            <img src={URL.createObjectURL(form.imageFile)} alt="preview" className="w-full h-full object-cover" />
          ) : form.imageUrl ? (
            <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
          ) : (
            <Camera size={24} className="text-gray-400" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={e => setForm(f => ({ ...f, imageFile: e.target.files[0] }))}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 text-sm"
        />
      </div>
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', searchTerm, selectedCategory],
    queryFn: async () => {
      const { default: api } = await import('../../services/api');
      const res = await api.get('/admin/products', { params: { search: searchTerm, category: selectedCategory } });
      return res.data;
    },
  });

  const products = data?.products || [];

  // ── Mutations ─────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const { default: api } = await import('../../services/api');
      return api.post('/admin/products', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      toast.success('Product added successfully');
      setShowAddModal(false);
      setForm(emptyForm);
    },
    onError: () => toast.error('Failed to add product'),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const { default: api } = await import('../../services/api');
      return api.put(`/admin/products/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      toast.success('Product updated successfully');
      setShowEditModal(false);
      setProductToEdit(null);
      setForm(emptyForm);
    },
    onError: () => toast.error('Failed to update product'),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isAvailable }) => {
      const { default: api } = await import('../../services/api');
      return api.put(`/admin/products/${id}`, { isAvailable });
    },
    onSuccess: (_, { isAvailable }) => {
      queryClient.invalidateQueries(['admin-products']);
      toast.success(isAvailable ? 'Product visible on menu' : 'Product hidden from menu');
    },
    onError: () => toast.error('Failed to update status'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { default: api } = await import('../../services/api');
      return api.delete(`/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      toast.success('Product deleted');
      setShowDeleteModal(false);
      setProductToDelete(null);
    },
    onError: () => toast.error('Failed to delete product'),
  });

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getStatusColor = (isAvailable) =>
    isAvailable
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';

  const buildPayload = (formData, existingImageUrl = '') =>
    new Promise(resolve => {
      if (formData.imageFile instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ ...formData, imageUrl: reader.result, imageFile: undefined });
        reader.readAsDataURL(formData.imageFile);
      } else {
        resolve({ ...formData, imageUrl: formData.imageUrl || existingImageUrl, imageFile: undefined });
      }
    });

  // ── Submit handlers ───────────────────────────────────────────────────────
  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return toast.error('Name and price are required');
    const payload = await buildPayload(form);
    createMutation.mutate(payload);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return toast.error('Name and price are required');
    const payload = await buildPayload(form, productToEdit?.imageUrl);
    updateMutation.mutate({ id: productToEdit.id, payload });
  };

  const handleEditOpen = (product) => {
    setProductToEdit(product);
    setForm({
      name: product.name,
      category: product.category || 'Main Course',
      price: product.price,
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      imageFile: null,
      isAvailable: product.isAvailable,
    });
    setShowEditModal(true);
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const actions = (
    <button
      onClick={() => { setForm(emptyForm); setShowAddModal(true); }}
      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
    >
      <Plus size={20} />
      <span>Add Product</span>
    </button>
  );

  return (
    <DashboardLayout title="Products Management" actions={actions}>
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
                <thead className="bg-gray-50 dark:bg-dark-700">
                  <tr>
                    {['Product', 'Category', 'Price', 'Status', 'Actions'].map(h => (
                      <th key={h} className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : 'text-left'}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <img
                            className="h-10 w-10 rounded-lg object-cover bg-gray-100 dark:bg-dark-700"
                            src={product.imageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop'}
                            alt={product.name}
                            onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop'; }}
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{product.category || '—'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">ETB {product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleMutation.mutate({ id: product.id, isAvailable: !product.isAvailable })}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors ${getStatusColor(product.isAvailable)}`}
                          title={product.isAvailable ? 'Click to hide from menu' : 'Click to show on menu'}
                        >
                          {product.isAvailable ? 'active' : 'inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button onClick={() => { setSelectedProduct(product); setShowViewModal(true); }}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="View">
                            <Eye size={16} />
                          </button>
                          <button onClick={() => handleEditOpen(product)}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 p-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors" title="Edit">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => { setProductToDelete(product.id); setShowDeleteModal(true); }}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">No products found.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Product">
        <form onSubmit={handleSubmitAdd} className="space-y-4">
          <FormFields form={form} setForm={setForm} />
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={() => setShowAddModal(false)}
              className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={createMutation.isPending}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 disabled:opacity-50">
              <Save size={16} />
              <span>{createMutation.isPending ? 'Saving...' : 'Add Product'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Product">
        <form onSubmit={handleSubmitEdit} className="space-y-4">
          <FormFields form={form} setForm={setForm} />
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={() => setShowEditModal(false)}
              className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={updateMutation.isPending}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 disabled:opacity-50">
              <Save size={16} />
              <span>{updateMutation.isPending ? 'Saving...' : 'Update Product'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Product Details">
        {selectedProduct && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={selectedProduct.imageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop'}
                alt={selectedProduct.name}
                className="w-24 h-24 rounded-lg object-cover"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop'; }}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedProduct.name}</h3>
                <p className="text-gray-500 dark:text-gray-400">{selectedProduct.category}</p>
                <p className="text-primary-600 dark:text-accent-400 font-bold text-lg">ETB {selectedProduct.price}</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{selectedProduct.description || 'No description.'}</p>
            <div className="flex justify-end pt-2">
              <button onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirm Delete">
        <p className="text-gray-600 dark:text-gray-400 mb-6">Are you sure you want to delete this product? This cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <button onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
            Cancel
          </button>
          <button onClick={() => deleteMutation.mutate(productToDelete)} disabled={deleteMutation.isPending}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default AdminProducts;
