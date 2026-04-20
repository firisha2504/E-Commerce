import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  UserCog,
  Tag,
  HeadphonesIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../common/ThemeToggle';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: Tag, label: 'Special Offers', path: '/admin/special-offers' },
    { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
    { icon: Users, label: 'Customers', path: '/admin/customers' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: HeadphonesIcon, label: 'Support', path: '/admin/support' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
    { icon: UserCog, label: 'My Profile', path: '/admin/profile' },
  ];

  const secondaryItems = [
    { icon: Home, label: 'Back to Website', path: '/' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`${isCollapsed ? 'w-14' : 'w-56'} bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 transition-all duration-300 flex flex-col h-screen sticky top-0`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-dark-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FA</span>
              </div>
              <span className="font-bold text-gray-800 dark:text-white">Admin Panel</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <Icon size={20} />
              {!isCollapsed && (
                <span className="ml-3">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Secondary Navigation */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-dark-700">
        {secondaryItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="sidebar-item text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              title={isCollapsed ? item.label : ''}
            >
              <Icon size={20} />
              {!isCollapsed && (
                <span className="ml-3">{item.label}</span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-dark-700 space-y-2">
        <div className="flex items-center justify-center">
          <ThemeToggle />
        </div>
        
        {!isCollapsed && (
          <button
            onClick={handleLogout}
            className="w-full sidebar-item text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;