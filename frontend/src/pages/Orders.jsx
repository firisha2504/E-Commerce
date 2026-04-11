import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Truck, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadOrders = () => {
      try {
        const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        // Filter orders for current user
        const userOrders = allOrders.filter(order => order.userId === user?.id);
        setOrders(userOrders);
      } catch (error) {
        console.error('Failed to load orders:', error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadOrders();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'confirmed':
        return <CheckCircle className="text-blue-500" size={20} />;
      case 'preparing':
        return <Package className="text-orange-500" size={20} />;
      case 'out_for_delivery':
        return <Truck className="text-purple-500" size={20} />;
      case 'delivered':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'cancelled':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Package className="text-gray-500" size={20} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'preparing':
        return 'Preparing';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'preparing':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-theme dark:bg-dark-theme">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 dark:border-accent-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-theme dark:bg-dark-theme py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">My Orders</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and manage your orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {['all', 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-primary-600 dark:bg-accent-500 text-white'
                  : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              {status === 'all' ? 'All Orders' : getStatusText(status)}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white dark:bg-dark-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div className="flex items-center space-x-3 mb-3 md:mb-0">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          Order #{order.orderId}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {order.paymentMethod === 'cbe' ? 'CBE Bank' : 
                         order.paymentMethod === 'awash' ? 'Awash Bank' :
                         order.paymentMethod === 'telebirr' ? 'TeleBirr' :
                         order.paymentMethod === 'ebirr' ? 'E-Birr' : order.paymentMethod}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-dark-700 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Items Ordered:</h4>
                        <div className="space-y-1">
                          {order.items.slice(0, 3).map((item, index) => (
                            <p key={index} className="text-sm text-gray-600 dark:text-gray-400">
                              {item.quantity}x {item.name} - ${(Number(item.price) * item.quantity).toFixed(2)}
                            </p>
                          ))}
                          {order.items.length > 3 && (
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                              +{order.items.length - 3} more items
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Delivery Address:</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.deliveryInfo.fullName}<br />
                          {order.deliveryInfo.address}<br />
                          {order.deliveryInfo.city}, {order.deliveryInfo.zipCode}<br />
                          {order.deliveryInfo.phone}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center border-t border-gray-200 dark:border-dark-700 pt-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.items.length} item(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                            <span className="text-gray-900 dark:text-gray-100">${order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                            <span className="text-gray-900 dark:text-gray-100">${order.tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Delivery:</span>
                            <span className="text-gray-900 dark:text-gray-100">
                              {order.deliveryFee === 0 ? 'FREE' : `$${order.deliveryFee.toFixed(2)}`}
                            </span>
                          </div>
                          <div className="flex justify-between font-bold">
                            <span className="text-gray-900 dark:text-gray-100">Total:</span>
                            <span className="text-gray-900 dark:text-gray-100">${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {statusFilter === 'all'
                ? "You haven't placed any orders yet."
                : `You don't have any ${getStatusText(statusFilter).toLowerCase()} orders.`}
            </p>
            <Link
              to="/products"
              className="inline-block bg-primary-600 dark:bg-accent-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 dark:hover:bg-accent-600 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;