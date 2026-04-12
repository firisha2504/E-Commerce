import React, { useState } from 'react';
import { Camera, Save, Upload } from 'lucide-react';
import DashboardLayout from '../../components/admin/DashboardLayout';
import Modal from '../../components/common/Modal';
import { useLogo } from '../../contexts/LogoContext';

const AdminSettings = () => {
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const { logoUrl, updateLogo, resetLogo } = useLogo();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [settings, setSettings] = useState({
    restaurantName: 'FA Restaurant',
    email: 'info@farestaurant.com',
    phone: '+251 911 234 567',
    address: '123 Restaurant Street, Addis Ababa',
    deliveryFee: '50',
    taxRate: '15',
    currency: 'ETB',
  });

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('File size must be less than 5MB');
        setShowErrorModal(true);
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please select an image file');
        setShowErrorModal(true);
        return;
      }

      setLogo(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would call the API to update settings
    
    // Update the logo globally if a new one was uploaded
    if (logoPreview) {
      updateLogo(logoPreview);
    }
    
    setShowSuccessModal(true);
  };

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Upload Section */}
          <div className="dashboard-card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Restaurant Logo
            </h2>
            
            <div className="flex items-center space-x-6">
              <div className="relative">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="w-32 h-32 rounded-lg object-cover border-4 border-primary-500"
                  />
                ) : (
                  <img
                    src={logoUrl}
                    alt="Current Restaurant Logo"
                    className="w-32 h-32 rounded-lg object-cover border-4 border-primary-500"
                    onError={(e) => {
                      // Fallback to text logo if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                )}
                
                {/* Fallback text logo */}
                <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg hidden items-center justify-center">
                  <span className="text-white text-4xl font-bold">FA</span>
                </div>
                
                {/* Camera Icon for Upload */}
                <label
                  htmlFor="logo-upload"
                  className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors shadow-lg"
                >
                  <Camera size={20} />
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </label>
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Upload Restaurant Logo
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Recommended size: 512x512px. Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP<br/>
                  <span className="text-primary-600 dark:text-accent-400 font-medium">
                    Your uploaded logo will appear immediately across the entire website.
                  </span>
                </p>
                <div className="flex space-x-3">
                  <label
                    htmlFor="logo-upload-button"
                    className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors cursor-pointer"
                  >
                    <Upload size={18} className="mr-2" />
                    Choose File
                    <input
                      id="logo-upload-button"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>
                  {(logoPreview || logoUrl !== '/images/fa-restaurant-logo.png') && (
                    <button
                      type="button"
                      onClick={() => {
                        setLogoPreview(null);
                        setLogo(null);
                        resetLogo();
                      }}
                      className="inline-flex items-center px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                    >
                      Reset to Default
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Restaurant Information */}
          <div className="dashboard-card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Restaurant Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  name="restaurantName"
                  value={settings.restaurantName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={settings.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="ETB">ETB - Ethiopian Birr</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Order Settings */}
          <div className="dashboard-card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Order Settings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Delivery Fee (ETB)
                </label>
                <input
                  type="number"
                  name="deliveryFee"
                  value={settings.deliveryFee}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  name="taxRate"
                  value={settings.taxRate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Save size={20} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <Modal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)}
        title="Success"
      >
        <p className="text-gray-900 dark:text-gray-100 mb-6">
          Settings have been updated successfully!
        </p>
        <div className="flex justify-end">
          <button
            onClick={() => setShowSuccessModal(false)}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            OK
          </button>
        </div>
      </Modal>

      {/* Error Modal */}
      <Modal 
        isOpen={showErrorModal} 
        onClose={() => setShowErrorModal(false)}
        title="Error"
      >
        <p className="text-gray-900 dark:text-gray-100 mb-6">
          {errorMessage}
        </p>
        <div className="flex justify-end">
          <button
            onClick={() => setShowErrorModal(false)}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            OK
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default AdminSettings;
