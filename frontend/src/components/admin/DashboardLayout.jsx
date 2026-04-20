import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, X, ShoppingBag, AlertTriangle, Star, CreditCard, Package, Users, Tag, BarChart3 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

const STORAGE_KEY = 'admin_notifications_read';

const buildNotificationsFromOrders = () => {
  try {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const readIds = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return orders
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(order => {
        const id = `order_${order.orderId}`;
        const diffMs = Date.now() - new Date(order.createdAt).getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHrs = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHrs / 24);
        const time = diffMins < 1 ? 'Just now'
          : diffMins < 60 ? `${diffMins}m ago`
          : diffHrs < 24 ? `${diffHrs}h ago`
          : `${diffDays}d ago`;
        return {
          id,
          title: 'New Order Received',
          message: `${order.orderId.slice(0, 22)}... from ${order.deliveryInfo?.fullName || 'Customer'}`,
          time,
          type: 'order',
          unread: !readIds.includes(id),
        };
      });
  } catch {
    return [];
  }
};

const DashboardLayout = ({ children, title, actions }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [notifications, setNotifications] = useState(buildNotificationsFromOrders);
  const searchRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const searchLinks = [
    { label: 'Dashboard',      path: '/admin',                icon: BarChart3,  keywords: ['dashboard', 'overview', 'stats'] },
    { label: 'Products',       path: '/admin/products',       icon: Package,    keywords: ['products', 'menu', 'items', 'food'] },
    { label: 'Special Offers', path: '/admin/special-offers', icon: Tag,        keywords: ['offers', 'discount', 'promo', 'deals'] },
    { label: 'Orders',         path: '/admin/orders',         icon: ShoppingBag,keywords: ['orders', 'delivery', 'pending'] },
    { label: 'Customers',      path: '/admin/customers',      icon: Users,      keywords: ['customers', 'users', 'clients'] },
    { label: 'Analytics',      path: '/admin/analytics',      icon: BarChart3,  keywords: ['analytics', 'reports', 'revenue', 'sales'] },
    { label: 'Settings',       path: '/admin/settings',       icon: User,       keywords: ['settings', 'config'] },
    { label: 'My Profile',     path: '/admin/profile',        icon: User,       keywords: ['profile', 'account', 'password'] },
    { label: 'Support',        path: '/admin/support',        icon: Bell,       keywords: ['support', 'help', 'faq'] },
  ];

  const filteredSearchResults = searchQuery.trim().length > 0
    ? searchLinks.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.keywords.some(k => k.includes(searchQuery.toLowerCase()))
      )
    : [];

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (showNotifications) setNotifications(buildNotificationsFromOrders());
  }, [showNotifications]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allIds));
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id) => {
    const readIds = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!readIds.includes(id)) localStorage.setItem(STORAGE_KEY, JSON.stringify([...readIds, id]));
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'order':   return <ShoppingBag size={14} className="text-blue-500" />;
      case 'alert':   return <AlertTriangle size={14} className="text-yellow-500" />;
      case 'review':  return <Star size={14} className="text-green-500" />;
      case 'payment': return <CreditCard size={14} className="text-purple-500" />;
      default:        return <Bell size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-900">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>

            <div className="flex items-center space-x-4">

              {/* Search */}
              <div className="relative" ref={searchRef}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setShowSearchResults(true); }}
                  onFocus={() => setShowSearchResults(true)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && filteredSearchResults.length > 0) {
                      navigate(filteredSearchResults[0].path);
                      setSearchQuery(''); setShowSearchResults(false);
                    }
                    if (e.key === 'Escape') setShowSearchResults(false);
                  }}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 w-56"
                />
                {showSearchResults && filteredSearchResults.length > 0 && (
                  <div className="absolute top-full mt-1 left-0 w-64 bg-white dark:bg-dark-800 rounded-lg shadow-xl border border-gray-200 dark:border-dark-700 z-50 overflow-hidden">
                    {filteredSearchResults.map(item => {
                      const Icon = item.icon;
                      return (
                        <button key={item.path}
                          onClick={() => { navigate(item.path); setSearchQuery(''); setShowSearchResults(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-dark-700 text-left transition-colors"
                        >
                          <Icon size={16} className="text-primary-500 dark:text-accent-400 flex-shrink-0" />
                          <span className="text-sm text-gray-900 dark:text-gray-100">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
                {showSearchResults && searchQuery.trim().length > 0 && filteredSearchResults.length === 0 && (
                  <div className="absolute top-full mt-1 left-0 w-64 bg-white dark:bg-dark-800 rounded-lg shadow-xl border border-gray-200 dark:border-dark-700 z-50 px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    No results for "{searchQuery}"
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 relative transition-colors"
                >
                  <Bell size={20} className="text-gray-600 dark:text-gray-400" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-200 dark:border-dark-700 py-2 z-50 max-h-96 overflow-y-auto">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-dark-700">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                      <button onClick={() => setShowNotifications(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded">
                        <X size={16} className="text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                          No notifications yet
                        </div>
                      ) : notifications.map(n => (
                        <div key={n.id}
                          onClick={() => markAsRead(n.id)}
                          className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-700 border-b border-gray-100 dark:border-dark-700 last:border-0 cursor-pointer ${n.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="mt-1 flex-shrink-0">{getIcon(n.type)}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{n.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                            </div>
                            {n.unread && <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="px-4 py-2 border-t border-gray-200 dark:border-dark-700">
                      <button onClick={markAllAsRead} className="text-sm text-primary-600 dark:text-accent-400 hover:text-primary-700 font-medium">
                        Mark all as read
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <Link to="/admin/profile" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="w-8 h-8 rounded-full object-cover border-2 border-primary-500" />
                ) : (
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                )}
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                </div>
              </Link>

              {/* Page Actions */}
              {actions && <div className="flex items-center space-x-2">{actions}</div>}

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
