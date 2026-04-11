import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import { User, Mail, Phone, MapPin, Lock, Save, Camera } from 'lucide-react';
import Modal from '../components/common/Modal';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [imagePreview, setImagePreview] = useState(user?.profileImage || null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = async (e) => {
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

      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload immediately
      try {
        const formData = new FormData();
        formData.append('profileImage', file);
        
        const response = await authAPI.uploadProfileImage(formData);
        console.log('Image uploaded:', response.data);
        setShowSuccessModal(true);
      } catch (error) {
        console.error('Failed to upload image:', error);
        setErrorMessage('Failed to upload image. Please try again.');
        setShowErrorModal(true);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would call the API to update the profile
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('address', formData.address);
    if (profileImage instanceof File) {
      formDataToSend.append('profileImage', profileImage);
    }
    
    console.log('Update profile:', formData);
    console.log('Profile image:', profileImage);
    setIsEditing(false);
    setShowSuccessModal(true);
  };

  return (
    <div className="min-h-screen bg-light-theme dark:bg-dark-theme py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-primary-500 dark:border-accent-500"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 dark:from-accent-500 dark:to-accent-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-3xl font-bold">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  
                  {/* Camera Icon for Upload */}
                  <label
                    htmlFor="profile-image-upload"
                    className="absolute bottom-0 right-0 bg-primary-600 dark:bg-accent-500 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 dark:hover:bg-accent-600 transition-colors shadow-lg"
                  >
                    <Camera size={16} />
                    <input
                      id="profile-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {user?.name || 'User Name'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{user?.email || 'user@example.com'}</p>
                <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-accent-900/30 text-primary-600 dark:text-accent-400 rounded-full text-sm font-medium">
                  {user?.role === 'admin' ? 'Admin' : 'Customer'}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Personal Information
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-primary-600 dark:text-accent-400 hover:text-primary-700 dark:hover:text-accent-300 font-medium"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <User className="inline mr-2" size={16} />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-dark-900 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Mail className="inline mr-2" size={16} />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-dark-900 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Phone className="inline mr-2" size={16} />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-dark-900 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <MapPin className="inline mr-2" size={16} />
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-dark-900 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-600 dark:bg-accent-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-accent-600 transition-colors flex items-center"
                    >
                      <Save className="mr-2" size={16} />
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Change Password Section */}
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Security
              </h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Lock className="text-gray-400" size={20} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Password</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Last changed 30 days ago
                    </p>
                  </div>
                </div>
                <button className="text-primary-600 dark:text-accent-400 hover:text-primary-700 dark:hover:text-accent-300 font-medium">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)}
        title="Success"
      >
        <p className="text-gray-900 dark:text-gray-100 mb-6">
          Your profile has been updated successfully!
        </p>
        <div className="flex justify-end">
          <button
            onClick={() => setShowSuccessModal(false)}
            className="bg-primary-600 dark:bg-accent-500 text-white px-6 py-2 rounded-lg hover:bg-primary-700 dark:hover:bg-accent-600 transition-colors"
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
    </div>
  );
};

export default Profile;