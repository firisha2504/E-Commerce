import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import DashboardLayout from '../../components/admin/DashboardLayout';
import Modal from '../../components/common/Modal';

const AdminAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [showExportModal, setShowExportModal] = useState(false);

  // Mock data - replace with real API calls
  const salesData = [
    { date: '2024-04-04', sales: 1200, orders: 8 },
    { date: '2024-04-05', sales: 1800, orders: 12 },
    { date: '2024-04-06', sales: 1500, orders: 10 },
    { date: '2024-04-07', sales: 2200, orders: 15 },
    { date: '2024-04-08', sales: 1900, orders: 13 },
    { date: '2024-04-09', sales: 2500, orders: 18 },
    { date: '2024-04-10', sales: 2100, orders: 14 }
  ];

  const topProducts = [
    { name: 'Doro Wot', sales: 45, revenue: 20250 },
    { name: 'Injera', sales: 120, revenue: 6000 },
    { name: 'Kitfo', sales: 32, revenue: 19200 },
    { name: 'Tibs', sales: 28, revenue: 14000 },
    { name: 'Ethiopian Coffee', sales: 85, revenue: 6800 }
  ];

  const customerMetrics = {
    totalCustomers: 245,
    newCustomers: 18,
    returningCustomers: 67,
    averageOrderValue: 580
  };

  const totalSales = salesData.reduce((sum, day) => sum + day.sales, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);

  const handleExport = () => {
    // Simulate export functionality
    const data = {
      period: selectedPeriod,
      totalSales,
      totalOrders,
      salesData,
      topProducts,
      customerMetrics,
      exportDate: new Date().toISOString()
    };
    
    // Create and download a JSON file (in a real app, this would be CSV/Excel)
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setShowExportModal(true);
  };

  const actions = (
    <div className="flex items-center space-x-2">
      <select
        value={selectedPeriod}
        onChange={(e) => setSelectedPeriod(e.target.value)}
        className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
      >
        <option value="7days">Last 7 Days</option>
        <option value="30days">Last 30 Days</option>
        <option value="90days">Last 90 Days</option>
        <option value="1year">Last Year</option>
      </select>
      <button 
        onClick={handleExport}
        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
      >
        <Download size={20} />
        <span>Export</span>
      </button>
    </div>
  );

  return (
    <DashboardLayout title="Analytics & Reports" actions={actions}>
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  ETB {totalSales.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">+12.5% from last period</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalOrders}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">+8.2% from last period</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {customerMetrics.totalCustomers}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">+5.1% from last period</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Order Value</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  ETB {customerMetrics.averageOrderValue}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">-2.3% from last period</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Trend</h3>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {salesData.map((day, index) => {
              const maxSales = Math.max(...salesData.map(d => d.sales));
              const height = (day.sales / maxSales) * 100;
              
              return (
                <div key={day.date} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-t-lg relative">
                    <div
                      className="bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg transition-all duration-300 hover:from-primary-600 hover:to-primary-500"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-xs font-medium text-gray-900 dark:text-white">
                    ETB {day.sales}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Top Products</h3>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {product.sales} sold
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      ETB {product.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Insights */}
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Customer Insights</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">New Customers</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">This period</p>
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {customerMetrics.newCustomers}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Returning Customers</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">This period</p>
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {customerMetrics.returningCustomers}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Customer Retention</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Return rate</p>
                </div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.round((customerMetrics.returningCustomers / customerMetrics.totalCustomers) * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Export Success Modal */}
      <Modal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)}
        title="Export Successful"
      >
        <p className="text-gray-900 dark:text-gray-100 mb-6">
          Analytics report has been exported successfully! The file has been downloaded to your computer.
        </p>
        <div className="flex justify-end">
          <button
            onClick={() => setShowExportModal(false)}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            OK
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default AdminAnalytics;