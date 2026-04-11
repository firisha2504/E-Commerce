import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Mail, Phone, MapPin, Calendar, ShoppingBag, Send, Edit, UserCheck, UserX, Crown, Star, Award } from 'lucide-react';
import DashboardLayout from '../../components/admin/DashboardLayout';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const AdminCustomers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [customers, setCustomers] = useState([]);
  const [newStatus, setNewStatus] = useState('');
  const [newCustomerType, setNewCustomerType] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = () => {
    // In a real app, this would fetch from API
    // For now, using mock data with enhanced customer management
    const mockCustomers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+251911123456',
        address: '123 Main St, Addis Ababa',
        joinDate: '2024-01-15',
        totalOrders: 12,
        totalSpent: 5400,
        lastOrder: '2024-04-08',
        status: 'active',
        customerType: 'vip',
        loyaltyPoints: 540,
        registrationSource: 'website',
        notes: 'Frequent customer, prefers spicy food'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+251911234567',
        address: '456 Oak Ave, Addis Ababa',
        joinDate: '2024-02-20',
        totalOrders: 8,
        totalSpent: 3200,
        lastOrder: '2024-04-10',
        status: 'active',
        customerType: 'regular',
        loyaltyPoints: 320,
        registrationSource: 'mobile_app',
        notes: ''
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+251911345678',
        address: '789 Pine Rd, Addis Ababa',
        joinDate: '2024-03-10',
        totalOrders: 3,
        totalSpent: 1200,
        lastOrder: '2024-03-25',
        status: 'inactive',
        customerType: 'regular',
        loyaltyPoints: 120,
        registrationSource: 'website',
        notes: 'Has not ordered in over 2 weeks'
      },
      {
        id: 4,
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        phone: '+251911456789',
        address: '321 Elm St, Addis Ababa',
        joinDate: '2024-01-05',
        totalOrders: 25,
        totalSpent: 12500,
        lastOrder: '2024-04-09',
        status: 'active',
        customerType: 'premium',
        loyaltyPoints: 1250,
        registrationSource: 'referral',
        notes: 'Premium customer, always orders large quantities'
      },
      {
        id: 5,
        name: 'Ahmed Hassan',
        email: 'ahmed@example.com',
        phone: '+251911567890',
        address: '654 Cedar Ave, Addis Ababa',
        joinDate: '2024-03-01',
        totalOrders: 0,
        totalSpent: 0,
        lastOrder: null,
        status: 'inactive',
        customerType: 'regular',
        loyaltyPoints: 0,
        registrationSource: 'website',
        notes: 'Registered but never placed an order'
      }
    ];
    setCustomers(mockCustomers);
  };

  const filters = ['all', 'active', 'inactive', 'suspended', 'regular', 'vip', 'premium'];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         customer.status === selectedFilter || 
                         customer.customerType === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getCustomerTypeColor = (type) => {
    switch (type) {
      case 'regular': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'vip': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'premium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getCustomerTypeIcon = (type) => {
    switch (type) {
      case 'vip': return <Crown size={14} className="text-purple-600" />;
      case 'premium': return <Award size={14} className="text-yellow-600" />;
      default: return <Star size={14} className="text-blue-600" />;
    }
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowViewModal(true);
  };

  const handleMessageCustomer = (customer) => {
    setSelectedCustomer(customer);
    setMessageText('');
    setShowMessageModal(true);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setNewStatus(customer.status);
    setNewCustomerType(customer.customerType);
    setShowStatusModal(true);
  };

  const handleSendMessage = () => {
    // In a real app, this would send the message via API
    console.log('Sending message to', selectedCustomer.email, ':', messageText);
    setShowMessageModal(false);
    setMessageText('');
    toast.success('Message sent successfully');
  };

  const handleUpdateCustomer = () => {
    if (!selectedCustomer) return;

    try {
      const updatedCustomers = customers.map(customer =>
        customer.id === selectedCustomer.id
          ? { ...customer, status: newStatus, customerType: newCustomerType }
          : customer
      );
      
      setCustomers(updatedCustomers);
      setShowStatusModal(false);
      setSelectedCustomer(null);
      toast.success('Customer updated successfully');
    } catch (error) {
      console.error('Failed to update customer:', error);
      toast.error('Failed to update customer');
    }
  };

  const getCustomerStats = () => {
    return {
      total: customers.length,
      active: customers.filter(c => c.status === 'active').length,
      inactive: customers.filter(c => c.status === 'inactive').length,
      suspended: customers.filter(c => c.status === 'suspended').length,
      regular: customers.filter(c => c.customerType === 'regular').length,
      vip: customers.filter(c => c.customerType === 'vip').length,
      premium: customers.filter(c => c.customerType === 'premium').length,
      avgOrders: customers.length > 0 ? Math.round(customers.reduce((sum, c) => sum + c.totalOrders, 0) / customers.length) : 0,
      totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0)
    };
  };

  const stats = getCustomerStats();

  return (
    <DashboardLayout title="Customers Management">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.active}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Crown className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">VIP</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.vip}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Premium</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.premium}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">${stats.totalRevenue.toLocaleString()}</p>
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
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 w-full sm:w-64"
                />
              </div>
              
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
              >
                {filters.map(filter => (
                  <option key={filter} value={filter}>
                    {filter === 'all' ? 'All Customers' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
              <thead className="bg-gray-50 dark:bg-dark-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Loyalty Points
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {customer.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Joined {customer.joinDate}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center space-x-1">
                          <Mail size={14} />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          <Phone size={14} />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {customer.totalOrders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${customer.totalSpent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                        {customer.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        {getCustomerTypeIcon(customer.customerType)}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCustomerTypeColor(customer.customerType)}`}>
                          {customer.customerType.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center space-x-1">
                        <Star size={14} className="text-yellow-500" />
                        <span>{customer.loyaltyPoints}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleViewCustomer(customer)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                          title="View Customer Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleEditCustomer(customer)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors duration-200"
                          title="Edit Customer"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleMessageCustomer(customer)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200"
                          title="Send Message"
                        >
                          <Mail size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No customers found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* View Customer Modal */}
      <Modal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)}
        title="Customer Details"
      >
        {selectedCustomer && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-lg">
                  {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedCustomer.name}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedCustomer.status)}`}>
                    {selectedCustomer.status.toUpperCase()}
                  </span>
                  <div className="flex items-center space-x-1">
                    {getCustomerTypeIcon(selectedCustomer.customerType)}
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCustomerTypeColor(selectedCustomer.customerType)}`}>
                      {selectedCustomer.customerType.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{selectedCustomer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{selectedCustomer.address}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Order Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedCustomer.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">${selectedCustomer.totalSpent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Loyalty Points</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-1">
                      <Star size={16} className="text-yellow-500" />
                      <span>{selectedCustomer.loyaltyPoints}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Registration Source</p>
                    <p className="text-sm text-gray-900 dark:text-white capitalize">{selectedCustomer.registrationSource.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Join Date</p>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedCustomer.joinDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last Order</p>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedCustomer.lastOrder || 'Never'}</p>
                  </div>
                </div>
              </div>

              {selectedCustomer.notes && (
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Notes</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCustomer.notes}</p>
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
                  handleMessageCustomer(selectedCustomer);
                }}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <Mail size={16} />
                <span>Send Message</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Send Message Modal */}
      <Modal 
        isOpen={showMessageModal} 
        onClose={() => setShowMessageModal(false)}
        title="Send Message to Customer"
      >
        {selectedCustomer && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Sending message to:</p>
              <p className="font-medium text-gray-900 dark:text-white">{selectedCustomer.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCustomer.email}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                placeholder="Type your message here..."
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowMessageModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
                <span>Send Message</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Customer Status Modal */}
      <Modal 
        isOpen={showStatusModal} 
        onClose={() => setShowStatusModal(false)}
        title="Edit Customer Status & Type"
      >
        {selectedCustomer && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Editing customer:</p>
              <p className="font-medium text-gray-900 dark:text-white">{selectedCustomer.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCustomer.email}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Customer Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-accent-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Customer Type
                </label>
                <select
                  value={newCustomerType}
                  onChange={(e) => setNewCustomerType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-accent-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="regular">Regular</option>
                  <option value="vip">VIP</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Customer Type Benefits:</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li><strong>Regular:</strong> Standard service</li>
                <li><strong>VIP:</strong> 10% discount + free delivery + priority support</li>
                <li><strong>Premium:</strong> 15% discount + free delivery + priority support + exclusive items</li>
              </ul>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCustomer}
                className="px-4 py-2 bg-primary-600 dark:bg-accent-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-accent-600 transition-colors"
              >
                Update Customer
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default AdminCustomers;