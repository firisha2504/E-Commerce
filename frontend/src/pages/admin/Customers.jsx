import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Mail, Phone, MapPin, Calendar, ShoppingBag, Send, Edit, UserCheck, UserX, Crown, Star, Award, Users, UserPlus } from 'lucide-react';
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
    // Load real customers from orders
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const realCustomers = [];
    const customerMap = new Map();

    // Extract unique customers from orders
    orders.forEach(order => {
      const customerKey = order.deliveryInfo.email.toLowerCase();
      
      if (!customerMap.has(customerKey)) {
        // Create customer from first order
        const customer = {
          id: `real_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: order.deliveryInfo.fullName,
          email: order.deliveryInfo.email,
          phone: order.deliveryInfo.phone,
          address: `${order.deliveryInfo.address}, ${order.deliveryInfo.city}, ${order.deliveryInfo.zipCode}`,
          joinDate: order.createdAt.split('T')[0], // Extract date part
          totalOrders: 0,
          totalSpent: 0,
          lastOrder: null,
          status: 'active',
          customerType: 'regular',
          loyaltyPoints: 0,
          registrationSource: 'checkout',
          notes: 'Customer from order system'
        };
        customerMap.set(customerKey, customer);
      }
      
      // Update customer statistics
      const customer = customerMap.get(customerKey);
      customer.totalOrders += 1;
      customer.totalSpent += Number(order.total);
      customer.loyaltyPoints += Math.floor(Number(order.total) / 10);
      
      // Update last order date
      if (!customer.lastOrder || new Date(order.createdAt) > new Date(customer.lastOrder)) {
        customer.lastOrder = order.createdAt.split('T')[0];
      }
      
      // Auto-promote based on spending
      if (customer.totalSpent >= 1000) {
        customer.customerType = 'premium';
      } else if (customer.totalSpent >= 500) {
        customer.customerType = 'vip';
      }
    });

    // Convert map to array
    realCustomers.push(...customerMap.values());

    // Load saved customer modifications from localStorage
    const savedCustomers = JSON.parse(localStorage.getItem('customerModifications') || '{}');
    realCustomers.forEach(customer => {
      if (savedCustomers[customer.email]) {
        customer.status = savedCustomers[customer.email].status || customer.status;
        customer.customerType = savedCustomers[customer.email].customerType || customer.customerType;
      }
    });

    // Add some mock customers for demo (you can remove this in production)
    const mockCustomers = [
      {
        id: 'mock_1',
        name: 'Demo Customer 1',
        email: 'demo1@example.com',
        phone: '+251911111111',
        address: '123 Demo St, Addis Ababa',
        joinDate: '2024-01-15',
        totalOrders: 5,
        totalSpent: 2500,
        lastOrder: '2024-04-08',
        status: 'active',
        customerType: 'vip',
        loyaltyPoints: 250,
        registrationSource: 'website',
        notes: 'Demo customer for testing'
      },
      {
        id: 'mock_2',
        name: 'Demo Customer 2',
        email: 'demo2@example.com',
        phone: '+251911222222',
        address: '456 Demo Ave, Addis Ababa',
        joinDate: '2024-02-20',
        totalOrders: 2,
        totalSpent: 800,
        lastOrder: '2024-04-10',
        status: 'inactive',
        customerType: 'regular',
        loyaltyPoints: 80,
        registrationSource: 'mobile_app',
        notes: 'Demo inactive customer'
      }
    ];

    // Combine real and mock customers
    const allCustomers = [...realCustomers, ...mockCustomers];
    setCustomers(allCustomers);
  };

  const filters = ['all', 'real', 'demo', 'active', 'inactive', 'suspended', 'regular', 'vip', 'premium'];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (selectedFilter === 'real') {
      matchesFilter = customer.registrationSource === 'checkout';
    } else if (selectedFilter === 'demo') {
      matchesFilter = customer.registrationSource !== 'checkout';
    } else if (selectedFilter !== 'all') {
      matchesFilter = customer.status === selectedFilter || customer.customerType === selectedFilter;
    }
    
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

  const getCustomerSourceIcon = (registrationSource) => {
    if (registrationSource === 'checkout') {
      return <Users size={14} className="text-green-600" title="Real Customer" />;
    } else {
      return <UserPlus size={14} className="text-blue-600" title="Demo Customer" />;
    }
  };

  const getCustomerSourceBadge = (registrationSource) => {
    if (registrationSource === 'checkout') {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <Users size={12} className="mr-1" />
          REAL
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          <UserPlus size={12} className="mr-1" />
          DEMO
        </span>
      );
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
      
      // Save customer modifications to localStorage for persistence
      const savedCustomers = JSON.parse(localStorage.getItem('customerModifications') || '{}');
      savedCustomers[selectedCustomer.email] = {
        status: newStatus,
        customerType: newCustomerType,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('customerModifications', JSON.stringify(savedCustomers));
      
      setShowStatusModal(false);
      setSelectedCustomer(null);
      toast.success('Customer updated successfully');
    } catch (error) {
      console.error('Failed to update customer:', error);
      toast.error('Failed to update customer');
    }
  };

  const getCustomerStats = () => {
    const realCustomers = customers.filter(c => c.registrationSource === 'checkout');
    const demoCustomers = customers.filter(c => c.registrationSource !== 'checkout');
    
    return {
      total: customers.length,
      real: realCustomers.length,
      demo: demoCustomers.length,
      active: customers.filter(c => c.status === 'active').length,
      inactive: customers.filter(c => c.status === 'inactive').length,
      suspended: customers.filter(c => c.status === 'suspended').length,
      regular: customers.filter(c => c.customerType === 'regular').length,
      vip: customers.filter(c => c.customerType === 'vip').length,
      premium: customers.filter(c => c.customerType === 'premium').length,
      avgOrders: customers.length > 0 ? Math.round(customers.reduce((sum, c) => sum + c.totalOrders, 0) / customers.length) : 0,
      totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
      realRevenue: realCustomers.reduce((sum, c) => sum + c.totalSpent, 0)
    };
  };

  const stats = getCustomerStats();

  return (
    <DashboardLayout title="Customers Management">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
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
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Real Customers</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.real}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Demo Customers</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.demo}</p>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Real Revenue</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">${stats.realRevenue.toLocaleString()}</p>
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
                    {filter === 'all' ? 'All Customers' : 
                     filter === 'real' ? 'Real Customers Only' :
                     filter === 'demo' ? 'Demo Customers Only' :
                     filter.charAt(0).toUpperCase() + filter.slice(1)}
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
                    Source
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
                      {getCustomerSourceBadge(customer.registrationSource)}
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
                  {getCustomerSourceBadge(selectedCustomer.registrationSource)}
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
                    <div className="flex items-center space-x-2">
                      {getCustomerSourceIcon(selectedCustomer.registrationSource)}
                      <span className="text-sm text-gray-900 dark:text-white capitalize">
                        {selectedCustomer.registrationSource === 'checkout' ? 'Real Customer (From Orders)' : 'Demo Customer'}
                      </span>
                    </div>
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