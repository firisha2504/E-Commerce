import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { ordersAPI } from '../services/api';

const OrderDetail = () => {
  const { id } = useParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await ordersAPI.getById(id);
      return response.data;
    },
    enabled: !!id,
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={24} />;
      case 'confirmed':
        return <CheckCircle className="text-blue-500" size={24} />;
      case 'preparing':
        return <Package className="text-orange-500" size={24} />;
      case 'out_for_delivery':
        return <Truck className="text-purple-500" size={24} />;
      case 'delivered':
        return <CheckCircle className="text-green-500" size={24} />;
      case 'cancelled':
        return <XCircle className="text-red-500" size={24} />;
      default:
        return <Package className="text-gray-500" size={24} />;
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

  if (!order) {
    return (
      <div className="min-h-screen bg-light-theme dark:bg-dark-theme py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Order Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">The order you're looking for doesn't exist.</p>
            <Link
              to="/orders"
              className="inline-flex items-center text-primary-600 dark:text-accent-400 hover:text-primary-700 dark:hover:text-accent-300"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-theme dark:bg-dark-theme py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/orders"
          className="inline-flex items-center text-primary-600 dark:text-accent-400 hover:text-primary-700 dark:hover:text-accent-300 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Orders
        </Link>

        {/* Header */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              {getStatusIcon(order.status)}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Order #{order.id.slice(0, 8)}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-dark-700 last:border-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-dark-700 rounded-lg"></div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.name || 'Product Name'}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Delivery Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-gray-100">${(order.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Delivery Fee</span>
                  <span className="text-gray-900 dark:text-gray-100">${(order.deliveryFee || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span className="text-gray-900 dark:text-gray-100">${(order.tax || 0).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-dark-700 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">Total</span>
                  <span className="font-bold text-xl text-gray-900 dark:text-gray-100">
                    ${(order.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Delivery Information</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="text-gray-400 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Delivery Address</p>
                    <p className="text-gray-900 dark:text-gray-100">
                      {order.deliveryAddress || '123 Main St, City, State 12345'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="text-gray-400 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Phone Number</p>
                    <p className="text-gray-900 dark:text-gray-100">
                      {order.phoneNumber || '+1 (555) 123-4567'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="text-gray-400 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <p className="text-gray-900 dark:text-gray-100">
                      {order.email || 'customer@example.com'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;