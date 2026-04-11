import React, { useState, useEffect } from 'react';
import { Camera, Save, Eye, EyeOff, User, Mail, Phone, MapPin, Lock } from 'lucide-react';
import DashboardLayout from '../../components/admin/DashboardLayout';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const AdminProfile = () => {
  const { user, updateUser, updateProfileImage } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(user?.profileImage || null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load saved profile data on component mount
  useEffect(() => {
    if (user?.id) {
      // Load saved profile image
      const savedImage = localStorage.getItem(`admin_profile_image_${user.id}`);
      if (savedImage) {
        setProfileImagePreview(savedImage);
      }
      
      // Load saved profile data
      const savedProfile = localStorage.getItem(`admin_profile_${user.id}`);
      if (savedProfile) {
        try {
          const profileData = JSON.parse(savedProfile);
          setFormData(prev => ({ ...prev, ...profileData }));
        } catch (error) {
          console.error('Failed to load saved profile:', error);
        }
      }
    }
  }, [user?.id]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
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
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Handle profile image upload if there's a new image
      if (profileImage) {
        // Store the image in localStorage for demo purposes
        // In a real app, you would upload to a server
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result;
          localStorage.setItem(`admin_profile_image_${user.id}`, imageUrl);
          setProfileImagePreview(imageUrl);
          // Update the user context with the new profile image
          updateProfileImage(imageUrl);
        };
        reader.readAsDataURL(profileImage);
      }
      
      // Store profile data in localStorage
      const updatedProfile = { ...formData };
      localStorage.setItem(`admin_profile_${user.id}`, JSON.stringify(updatedProfile));
      
      setIsEditing(false);
      setShowSuccessModal(true);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      setErrorMessage('Failed to update profile. Please try again.');
      setShowErrorModal(true);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('New passwords do not match');
      setShowErrorModal(true);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long');
      setShowErrorModal(true);
      return;
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would call the API to change password
      console.log('Change password:', passwordData);
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordModal(false);
      
      // Show success message for password change
      setErrorMessage('Password changed successfully!');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Password change error:', error);
      setErrorMessage('Failed to change password. Please try again.');
      setShowErrorModal(true);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    });
    setProfileImagePreview(user?.profileImage || null);
    setProfileImage(null);
    setIsEditing(false);
  };

  return (
    <DashboardLayout title="Admin Profile">
      <div className="max-w-4xl">
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Profile Information
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                >
                  <User size={18} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                  >
                    <Save size={18} />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Profile Image */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {profileImagePreview ? (
                    <img
                      src={profileImagePreview}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-primary-500"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                      </span>
                    </div>
                  )}
                  
                  {isEditing && (
                    <label
                      htmlFor="profile-image-upload"
                      className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors shadow-lg"
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
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {user?.name || 'Admin User'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Administrator Account
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {isEditing ? 'Click the camera icon to change your profile picture' : 'Profile picture'}
                  </p>
                </div>
              </div>

              {/* Profile Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User size={16} className="inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-dark-800 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Mail size={16} className="inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-dark-800 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Phone size={16} className="inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-dark-800 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin size={16} className="inline mr-2" />
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-dark-800 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Security Section */}
          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Security Settings
              </h2>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Lock size={18} />
                <span>Change Password</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Password</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last changed: Never (or show actual date)
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Account Type</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Administrator - Full access to all restaurant management features
                </p>
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

      {/* Change Password Modal */}
      <Modal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
      >
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength={6}
                className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowPasswordModal(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Change Password
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default AdminProfile;