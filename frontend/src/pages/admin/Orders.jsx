import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit, Package, Clock, CheckCircle, XCircle, Truck, CreditCard, Banknote } from 'lucide-react';
import DashboardLayout from '../../components/admin/DashboardLayout';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    try {
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      setOrders(allOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setOrders([]);
    }
  };

  const statuses = ['all', 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.deliveryInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.deliveryInfo.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowUpdateModal(true);
  };

  const confirmUpdateStatus = () => {
    if (!selectedOrder || !newStatus) return;

    try {
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = allOrders.map(order => 
        order.orderId === selectedOrder.orderId 
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      );
      
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
      setShowUpdateModal(false);
      setSelectedOrder(null);
      toast.success('Order status updated successfully');
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} className="text-yellow-500" />;
      case 'confirmed': return <CheckCircle size={16} className="text-blue-500" />;
      case 'preparing': return <Package size={16} className="text-orange-500" />;
      case 'out_for_delivery': return <Truck size={16} className="text-purple-500" />;
      case 'delivered': return <CheckCircle size={16} className="text-green-500" />;
      case 'cancelled': return <XCircle size={16} className="text-red-500" />;
      default: return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'preparing': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Preparing';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getPaymentIcon = (paymentMethod) => {
    return paymentMethod === 'card' 
      ? <CreditCard size={16} className="text-blue-500" />
      : <Banknote size={16} className="text-green-500" />;
  };

  const getTotalRevenue = () => {
    return orders
      .filter(order => order.status === 'delivered')
      .reduce((total, order) => total + order.total, 0);
  };

  return (
    <DashboardLayout title="Orders Management">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Confirmed</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {orders.filter(o => o.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Package className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Preparing</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {orders.filter(o => o.status === 'preparing').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Delivered</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  ${getTotalRevenue().toFixed(2)}
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
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 w-full sm:w-64"
                />
              </div>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : getStatusText(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
              <thead className="bg-gray-50 dark:bg-dark-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                {filteredOrders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.deliveryInfo.fullName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {order.deliveryInfo.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {order.items.length} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getPaymentIcon(order.paymentMethod)}
                        <span className="text-sm text-gray-900 dark:text-white">
                          {order.paymentMethod === 'card' ? 'Card' : 'Cash'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div>
                        <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                        <div>{new Date(order.createdAt).toLocaleTimeString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleViewOrder(order)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                          title="View Order Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(order)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors duration-200"
                          title="Update Status"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No orders found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* View Order Modal */}
      <Modal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)}
        title="Order Details"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Order ID</h4>
                <p className="text-gray-600 dark:text-gray-400">{selectedOrder.orderId}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Status</h4>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(selectedOrder.status)}
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Customer Information</h4>
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-3 space-y-1">
                <p className="text-sm"><span className="font-medium">Name:</span> {selectedOrder.deliveryInfo.fullName}</p>
                <p className="text-sm"><span className="font-medium">Email:</span> {selectedOrder.deliveryInfo.email}</p>
                <p className="text-sm"><span className="font-medium">Phone:</span> {selectedOrder.deliveryInfo.phone}</p>
                <p className="text-sm"><span className="font-medium">Address:</span> {selectedOrder.deliveryInfo.address}, {selectedOrder.deliveryInfo.city}, {selectedOrder.deliveryInfo.zipCode}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Payment Information</h4>
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  {getPaymentIcon(selectedOrder.paymentMethod)}
                  <span className="text-sm font-medium">
                    {selectedOrder.paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Order Items</h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 dark:bg-dark-700 rounded-lg p-3">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity} × ${Number(item.price).toFixed(2)}</p>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedOrder.orderNotes && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Order Notes</h4>
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedOrder.orderNotes}</p>
                </div>
              </div>
            )}
            
            <div className="border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="text-gray-900 dark:text-white">${selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                  <span className="text-gray-900 dark:text-white">${selectedOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Delivery Fee:</span>
                  <span className="text-gray-900 dark:text-white">
                    {selectedOrder.deliveryFee === 0 ? 'FREE' : `$${selectedOrder.deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount:</span>
                  <span className="text-lg font-bold text-primary-600 dark:text-accent-400">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Ordered on {new Date(selectedOrder.createdAt).toLocaleDateString()} at {new Date(selectedOrder.createdAt).toLocaleTimeString()}
              </p>
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
                  handleUpdateStatus(selectedOrder);
                }}
                className="bg-primary-600 dark:bg-accent-500 text-white px-4 py-2 rounded-lg hover:bg-primary-700 dark:hover:bg-accent-600 transition-colors"
              >
                Update Status
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal 
        isOpen={showUpdateModal} 
        onClose={() => setShowUpdateModal(false)}
        title="Update Order Status"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Update status for order <span className="font-medium">{selectedOrder.orderId}</span>
              </p>
              
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-accent-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
              >
                {statuses.filter(status => status !== 'all').map(status => (
                  <option key={status} value={status}>
                    {getStatusText(status)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpdateStatus}
                className="px-4 py-2 bg-primary-600 dark:bg-accent-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-accent-600 transition-colors"
              >
                Update Status
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default AdminOrders;