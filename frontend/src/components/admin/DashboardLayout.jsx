import React, { useState } from 'react';
import { Search, Bell, User, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

const DashboardLayout = ({ children, title, actions }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useAuth();

  // Mock notifications data with state management
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Order Received',
      message: 'Order #127006 from John Doe',
      time: '2 minutes ago',
      type: 'order',
      unread: true
    },
    {
      id: 2,
      title: 'Low Stock Alert',
      message: 'Ethiopian Coffee is running low',
      time: '15 minutes ago',
      type: 'alert',
      unread: true
    },
    {
      id: 3,
      title: 'Customer Review',
      message: 'New 5-star review received',
      time: '1 hour ago',
      type: 'review',
      unread: false
    },
    {
      id: 4,
      title: 'Payment Received',
      message: 'Payment for Order #127005 confirmed',
      time: '2 hours ago',
      type: 'payment',
      unread: false
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      unread: false
    })));
  };

  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, unread: false }
        : notification
    ));
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-900">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 w-64"
                />
              </div>
              
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 relative transition-colors duration-200"
                >
                  <Bell size={20} className="text-gray-600 dark:text-gray-400" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-200 dark:border-dark-700 py-2 z-50 max-h-96 overflow-y-auto">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-dark-700">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded"
                      >
                        <X size={16} className="text-gray-500" />
                      </button>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-700 border-b border-gray-100 dark:border-dark-700 last:border-0 cursor-pointer ${
                            notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.unread ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="px-4 py-2 border-t border-gray-200 dark:border-dark-700">
                      <button 
                        onClick={markAllAsRead}
                        className="text-sm text-primary-600 dark:text-accent-400 hover:text-primary-700 dark:hover:text-accent-300 font-medium transition-colors duration-200"
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Menu */}
              <Link 
                to="/admin/profile"
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors duration-200"
              >
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-primary-500"
                  />
                ) : (
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                )}
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Administrator
                  </p>
                </div>
              </Link>
              
              {/* Actions */}
              {actions && (
                <div className="flex items-center space-x-2">
                  {actions}
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;