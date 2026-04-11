import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Save, Calendar, Percent, Tag as TagIcon, Gift } from 'lucide-react';
import DashboardLayout from '../../components/admin/DashboardLayout';
import Modal from '../../components/common/Modal';
import { processImageFile, getImageSrc, createImagePreview } from '../../utils/imageUpload';
import toast from 'react-hot-toast';

const AdminSpecialOffers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);
  const [offerToEdit, setOfferToEdit] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [offers, setOffers] = useState([]);
  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    promoCode: '',
    validFrom: '',
    validUntil: '',
    category: 'General',
    status: 'active',
    minOrderAmount: '',
    maxDiscount: '',
    usageLimit: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = () => {
    try {
      const savedOffers = JSON.parse(localStorage.getItem('specialOffers') || '[]');
      
      // Add some default offers if none exist
      if (savedOffers.length === 0) {
        const defaultOffers = [
          {
            id: 1,
            title: 'Weekend Special',
            description: 'Get 15% off on all orders every Saturday and Sunday',
            discountType: 'percentage',
            discountValue: 15,
            promoCode: 'WEEKEND15',
            validFrom: '2024-04-01',
            validUntil: '2024-12-31',
            category: 'Weekend Deal',
            status: 'active',
            minOrderAmount: 100,
            maxDiscount: 200,
            usageLimit: 1000,
            usedCount: 45,
            image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            title: 'First Order Discount',
            description: 'New customers get 20% off their first order',
            discountType: 'percentage',
            discountValue: 20,
            promoCode: 'FIRST20',
            validFrom: '2024-04-01',
            validUntil: '2024-12-31',
            category: 'New Customer',
            status: 'active',
            minOrderAmount: 50,
            maxDiscount: 150,
            usageLimit: 500,
            usedCount: 23,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
            createdAt: new Date().toISOString()
          }
        ];
        localStorage.setItem('specialOffers', JSON.stringify(defaultOffers));
        setOffers(defaultOffers);
      } else {
        setOffers(savedOffers);
      }
    } catch (error) {
      console.error('Failed to load offers:', error);
      setOffers([]);
    }
  };

  const saveOffers = (updatedOffers) => {
    try {
      localStorage.setItem('specialOffers', JSON.stringify(updatedOffers));
      setOffers(updatedOffers);
    } catch (error) {
      console.error('Failed to save offers:', error);
      toast.error('Failed to save offers');
    }
  };

  const statuses = ['all', 'active', 'inactive', 'expired'];

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.promoCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (selectedStatus === 'expired') {
      matchesStatus = new Date(offer.validUntil) < new Date();
    } else if (selectedStatus !== 'all') {
      matchesStatus = offer.status === selectedStatus;
    }
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (offer) => {
    if (new Date(offer.validUntil) < new Date()) {
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    }
    switch (offer.status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusText = (offer) => {
    if (new Date(offer.validUntil) < new Date()) {
      return 'Expired';
    }
    return offer.status.charAt(0).toUpperCase() + offer.status.slice(1);
  };

  const handleAddOffer = () => {
    setNewOffer({
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      promoCode: '',
      validFrom: '',
      validUntil: '',
      category: 'General',
      status: 'active',
      minOrderAmount: '',
      maxDiscount: '',
      usageLimit: '',
      image: ''
    });
    setImageFile(null);
    setImagePreview('');
    setShowAddModal(true);
  };

  const handleSubmitOffer = async (e) => {
    e.preventDefault();
    
    if (!newOffer.title || !newOffer.description || !newOffer.discountValue || !newOffer.promoCode) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    let finalImageUrl = newOffer.image; // URL input
    
    // Handle local image upload
    if (imageFile) {
      try {
        const imageUrl = await processImageFile(imageFile);
        finalImageUrl = imageUrl;
      } catch (error) {
        toast.error('Failed to process image');
        return;
      }
    }
    
    const offerToAdd = {
      id: Date.now(),
      ...newOffer,
      image: finalImageUrl,
      discountValue: parseFloat(newOffer.discountValue),
      minOrderAmount: parseFloat(newOffer.minOrderAmount) || 0,
      maxDiscount: parseFloat(newOffer.maxDiscount) || 0,
      usageLimit: parseInt(newOffer.usageLimit) || 0,
      usedCount: 0,
      createdAt: new Date().toISOString()
    };
    
    const updatedOffers = [...offers, offerToAdd];
    saveOffers(updatedOffers);
    setShowAddModal(false);
    setImageFile(null);
    setImagePreview('');
    toast.success('Special offer created successfully');
  };

  const handleInputChange = (field, value) => {
    setNewOffer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleViewOffer = (offer) => {
    setSelectedOffer(offer);
    setShowViewModal(true);
  };

  const handleEditOffer = (offer) => {
    setOfferToEdit(offer);
    setNewOffer({
      title: offer.title,
      description: offer.description,
      discountType: offer.discountType,
      discountValue: offer.discountValue.toString(),
      promoCode: offer.promoCode,
      validFrom: offer.validFrom,
      validUntil: offer.validUntil,
      category: offer.category,
      status: offer.status,
      minOrderAmount: offer.minOrderAmount.toString(),
      maxDiscount: offer.maxDiscount.toString(),
      usageLimit: offer.usageLimit.toString(),
      image: offer.image
    });
    setImageFile(null);
    setImagePreview(offer.image || '');
    setShowEditModal(true);
  };

  const handleUpdateOffer = async (e) => {
    e.preventDefault();
    
    if (!newOffer.title || !newOffer.description || !newOffer.discountValue || !newOffer.promoCode) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    let finalImageUrl = newOffer.image; // Keep existing image or URL input
    
    // Handle local image upload
    if (imageFile) {
      try {
        const imageUrl = await processImageFile(imageFile);
        finalImageUrl = imageUrl;
      } catch (error) {
        toast.error('Failed to process image');
        return;
      }
    }
    
    const updatedOffers = offers.map(o => 
      o.id === offerToEdit.id 
        ? {
            ...o,
            ...newOffer,
            image: finalImageUrl,
            discountValue: parseFloat(newOffer.discountValue),
            minOrderAmount: parseFloat(newOffer.minOrderAmount) || 0,
            maxDiscount: parseFloat(newOffer.maxDiscount) || 0,
            usageLimit: parseInt(newOffer.usageLimit) || 0,
            updatedAt: new Date().toISOString()
          }
        : o
    );
    
    saveOffers(updatedOffers);
    setShowEditModal(false);
    setOfferToEdit(null);
    setImageFile(null);
    setImagePreview('');
    toast.success('Special offer updated successfully');
  };

  const handleDeleteOffer = (offerId) => {
    setOfferToDelete(offerId);
    setShowDeleteModal(true);
  };

  const confirmDeleteOffer = () => {
    if (offerToDelete) {
      const updatedOffers = offers.filter(o => o.id !== offerToDelete);
      saveOffers(updatedOffers);
      setOfferToDelete(null);
      toast.success('Special offer deleted successfully');
    }
    setShowDeleteModal(false);
  };

  const getDiscountDisplay = (offer) => {
    if (offer.discountType === 'percentage') {
      return `${offer.discountValue}% OFF`;
    } else if (offer.discountType === 'fixed') {
      return `ETB ${offer.discountValue} OFF`;
    } else {
      return offer.discountValue;
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      createImagePreview(file, setImagePreview);
    }
  };

  const actions = (
    <button 
      onClick={handleAddOffer}
      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
    >
      <Plus size={20} />
      <span>Add Special Offer</span>
    </button>
  );

  return (
    <DashboardLayout title="Special Offers Management" actions={actions}>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TagIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Offers</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{offers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Gift className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Offers</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {offers.filter(o => o.status === 'active' && new Date(o.validUntil) >= new Date()).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Percent className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Usage</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {offers.reduce((sum, o) => sum + (o.usedCount || 0), 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Calendar className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expired</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {offers.filter(o => new Date(o.validUntil) < new Date()).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search offers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 w-full sm:w-64"
                />
              </div>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 pr-10 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 min-w-48"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Offers Table */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
              <thead className="bg-gray-50 dark:bg-dark-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Offer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Promo Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Valid Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Usage
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
                {filteredOffers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={getImageSrc(offer.image)}
                          alt={offer.title}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                          <TagIcon size={20} className="text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {offer.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {offer.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {getDiscountDisplay(offer)}
                      </div>
                      {offer.minOrderAmount > 0 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Min: ETB {offer.minOrderAmount}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="bg-gray-100 dark:bg-dark-700 px-2 py-1 rounded text-sm font-mono">
                        {offer.promoCode}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div>{new Date(offer.validFrom).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        to {new Date(offer.validUntil).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div>{offer.usedCount || 0}</div>
                      {offer.usageLimit > 0 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          / {offer.usageLimit} limit
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(offer)}`}>
                        {getStatusText(offer)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleViewOffer(offer)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleEditOffer(offer)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors duration-200" 
                          title="Edit Offer"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteOffer(offer.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                          title="Delete Offer"
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

        {filteredOffers.length === 0 && (
          <div className="text-center py-12">
            <TagIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No special offers found matching your criteria.</p>
          </div>
        )}
      </div>
      {/* Add Offer Modal */}
      <Modal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        title="Add New Special Offer"
      >
        <form onSubmit={handleSubmitOffer} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Offer Title *
              </label>
              <input
                type="text"
                value={newOffer.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter offer title"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select 
                value={newOffer.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
              >
                <option>General</option>
                <option>Weekend Deal</option>
                <option>New Customer</option>
                <option>Lunch Special</option>
                <option>Family Deal</option>
                <option>Beverage Deal</option>
                <option>Birthday Offer</option>
                <option>Holiday Special</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Discount Type *
              </label>
              <select 
                value={newOffer.discountType}
                onChange={(e) => handleInputChange('discountType', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (ETB)</option>
                <option value="free_item">Free Item</option>
                <option value="buy_x_get_y">Buy X Get Y</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Discount Value *
              </label>
              <input
                type="number"
                value={newOffer.discountValue}
                onChange={(e) => handleInputChange('discountValue', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                placeholder={newOffer.discountType === 'percentage' ? '15' : '50'}
                min="0"
                step={newOffer.discountType === 'percentage' ? '1' : '0.01'}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Promo Code *
              </label>
              <input
                type="text"
                value={newOffer.promoCode}
                onChange={(e) => handleInputChange('promoCode', e.target.value.toUpperCase())}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                placeholder="WEEKEND15"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select 
                value={newOffer.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valid From *
              </label>
              <input
                type="date"
                value={newOffer.validFrom}
                onChange={(e) => handleInputChange('validFrom', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valid Until *
              </label>
              <input
                type="date"
                value={newOffer.validUntil}
                onChange={(e) => handleInputChange('validUntil', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min Order Amount (ETB)
              </label>
              <input
                type="number"
                value={newOffer.minOrderAmount}
                onChange={(e) => handleInputChange('minOrderAmount', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Discount (ETB)
              </label>
              <input
                type="number"
                value={newOffer.maxDiscount}
                onChange={(e) => handleInputChange('maxDiscount', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Usage Limit
              </label>
              <input
                type="number"
                value={newOffer.usageLimit}
                onChange={(e) => handleInputChange('usageLimit', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                placeholder="0 (unlimited)"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={newOffer.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              rows={3}
              value={newOffer.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter offer description"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Image from Computer (Alternative to URL above)
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-gray-200 dark:bg-dark-600 rounded-lg flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <TagIcon size={32} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Max size: 5MB. Supported formats: JPG, PNG, GIF, WebP
                </p>
              </div>
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
              <span>Create Offer</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Offer Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        title="Edit Special Offer"
      >
        <form onSubmit={handleUpdateOffer} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Offer Title *
              </label>
              <input
                type="text"
                value={newOffer.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter offer title"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select 
                value={newOffer.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
              >
                <option>General</option>
                <option>Weekend Deal</option>
                <option>New Customer</option>
                <option>Lunch Special</option>
                <option>Family Deal</option>
                <option>Beverage Deal</option>
                <option>Birthday Offer</option>
                <option>Holiday Special</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Discount Type *
              </label>
              <select 
                value={newOffer.discountType}
                onChange={(e) => handleInputChange('discountType', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (ETB)</option>
                <option value="free_item">Free Item</option>
                <option value="buy_x_get_y">Buy X Get Y</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Discount Value *
              </label>
              <input
                type="number"
                value={newOffer.discountValue}
                onChange={(e) => handleInputChange('discountValue', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                placeholder={newOffer.discountType === 'percentage' ? '15' : '50'}
                min="0"
                step={newOffer.discountType === 'percentage' ? '1' : '0.01'}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Promo Code *
              </label>
              <input
                type="text"
                value={newOffer.promoCode}
                onChange={(e) => handleInputChange('promoCode', e.target.value.toUpperCase())}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                placeholder="WEEKEND15"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select 
                value={newOffer.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valid From *
              </label>
              <input
                type="date"
                value={newOffer.validFrom}
                onChange={(e) => handleInputChange('validFrom', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valid Until *
              </label>
              <input
                type="date"
                value={newOffer.validUntil}
                onChange={(e) => handleInputChange('validUntil', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min Order Amount (ETB)
              </label>
              <input
                type="number"
                value={newOffer.minOrderAmount}
                onChange={(e) => handleInputChange('minOrderAmount', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Discount (ETB)
              </label>
              <input
                type="number"
                value={newOffer.maxDiscount}
                onChange={(e) => handleInputChange('maxDiscount', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Usage Limit
              </label>
              <input
                type="number"
                value={newOffer.usageLimit}
                onChange={(e) => handleInputChange('usageLimit', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                placeholder="0 (unlimited)"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={newOffer.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              rows={3}
              value={newOffer.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter offer description"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Image from Computer (Alternative to URL above)
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-gray-200 dark:bg-dark-600 rounded-lg flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <TagIcon size={32} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Max size: 5MB. Supported formats: JPG, PNG, GIF, WebP
                </p>
              </div>
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
              <span>Update Offer</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* View Offer Modal */}
      <Modal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)}
        title="Special Offer Details"
      >
        {selectedOffer && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <TagIcon size={32} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedOffer.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedOffer.category}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOffer)}`}>
                    {getStatusText(selectedOffer)}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Description</h4>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedOffer.description}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Discount</h4>
                <p className="text-gray-600 dark:text-gray-400">{getDiscountDisplay(selectedOffer)}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Promo Code</h4>
                <code className="bg-gray-100 dark:bg-dark-700 px-2 py-1 rounded text-sm font-mono">
                  {selectedOffer.promoCode}
                </code>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Valid Period</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {new Date(selectedOffer.validFrom).toLocaleDateString()} - {new Date(selectedOffer.validUntil).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Usage</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedOffer.usedCount || 0} / {selectedOffer.usageLimit || '∞'}
                </p>
              </div>
              {selectedOffer.minOrderAmount > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Min Order</h4>
                  <p className="text-gray-600 dark:text-gray-400">ETB {selectedOffer.minOrderAmount}</p>
                </div>
              )}
              {selectedOffer.maxDiscount > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Max Discount</h4>
                  <p className="text-gray-600 dark:text-gray-400">ETB {selectedOffer.maxDiscount}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowViewModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setShowViewModal(false);
                  handleEditOffer(selectedOffer);
                }}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Edit Offer
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this special offer? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteOffer}
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

export default AdminSpecialOffers;