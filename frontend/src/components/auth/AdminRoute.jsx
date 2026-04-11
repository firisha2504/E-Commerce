import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 dark:border-accent-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-light-theme dark:bg-dark-theme flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">403</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Access Denied</p>
          <p className="text-gray-500 dark:text-gray-500">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;