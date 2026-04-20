import React, { useState } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Star
} from 'lucide-react';
import DashboardLayout from '../../components/admin/DashboardLayout';
import StatsCard from '../../components/admin/StatsCard';

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Past Month');

  // Mock data - replace with real API calls
  const stats = [
    {
      title: 'Total Revenue',
      value: 'ETB 145,320',
      change: '+12.5%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'New Orders',
      value: '18',
      change: '+8.2%',
      changeType: 'increase',
      icon: ShoppingBag,
      color: 'blue'
    },
    {
      title: 'Active Users',
      value: '245',
      change: '+5.1%',
      changeType: 'increase',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Average Order Value',
      value: 'ETB 580',
      change: '-2.3%',
      changeType: 'decrease',
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  const recentOrders = [
    { id: '127001', customer: 'Admin', product: 'Doro Wat', description: 'Ethiopian exemption...', status: 'Paid - In Preparation', total: 'ETB 580' },
    { id: '127002', customer: 'Shiro Tagamino', product: 'Doro Wat', description: 'Ethiopian ammame...', status: 'Shipped', total: 'ETB 580' },
    { id: '127003', customer: 'Doro Wat', product: 'Tuna Pizza', description: 'Passion exotion for...', status: 'Delivered', total: 'ETB 450' },
    { id: '127004', customer: 'Doro Wat', product: 'Tuna Pizza', description: 'Tuna Pizza ommame...', status: 'Shipped', total: 'ETB 320' },
    { id: '127005', customer: 'Shiro Tagamino', product: 'Passion Fruit Juice', description: 'Passion Fruit Juice f...', status: 'Delivered', total: 'ETB 15,520' }
  ];

  const stockAlerts = [
    { name: 'Shiro Tagamino', status: 'stock', color: 'red' },
    { name: 'Tuna Pizza', status: 'Low', color: 'yellow' }
  ];

  const feedbackActivity = [
    { text: 'Recent feedback form 1', sentiment: 4.8, color: 'green' },
    { text: 'Recent feedback form succes...', sentiment: 4.8, color: 'green' },
    { text: 'Recent feedback form 2', sentiment: 4.7, color: 'green' },
    { text: 'Recent feedback form succes...', sentiment: 4.7, color: 'green' },
    { text: 'Recent feedback form 3', sentiment: 6.5, color: 'yellow' },
    { text: 'Recent feedback form succes...', sentiment: 6.5, color: 'yellow' },
    { text: 'Recent feedback form 4', sentiment: 4.8, color: 'green' },
    { text: 'Recent feedback form succes...', sentiment: 4.8, color: 'green' }
  ];

  const heatmapData = [
    { day: 'Mon', hours: [2, 3, 4, 5, 6, 7, 8] },
    { day: 'Tue', hours: [3, 4, 5, 6, 7, 8, 9] },
    { day: 'Wed', hours: [4, 5, 6, 7, 8, 9, 10] },
    { day: 'Thu', hours: [5, 6, 7, 8, 9, 10, 11] },
    { day: 'Fri', hours: [6, 7, 8, 9, 10, 11, 12] },
    { day: 'Sat', hours: [7, 8, 9, 10, 11, 12, 13] },
    { day: 'Sun', hours: [8, 9, 10, 11, 12, 13, 14] }
  ];

  const getHeatmapColor = (value) => {
    if (value >= 12) return 'bg-orange-600';
    if (value >= 10) return 'bg-orange-500';
    if (value >= 8) return 'bg-orange-400';
    if (value >= 6) return 'bg-yellow-500';
    if (value >= 4) return 'bg-green-500';
    return 'bg-green-400';
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'paid - in preparation':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <DashboardLayout title="Dashboard Overview">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue & Orders Trends - Takes 2 columns */}
          <div className="lg:col-span-2 dashboard-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue & Orders Trends</h3>
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 text-sm"
              >
                <option>Past Month</option>
                <option>Past 3 Months</option>
                <option>Past Year</option>
              </select>
            </div>
            
            {/* Sales Trend Chart - Enhanced & Guaranteed Visible */}
            <div className="h-44 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-700 dark:to-dark-800 rounded-lg p-4 border border-gray-200 dark:border-dark-600">
              <div className="mb-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Weekly Performance</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Revenue (Green) vs Orders (Orange)</p>
              </div>
              <div className="grid grid-cols-7 gap-3 h-24 items-end">
                {/* Monday */}
                <div className="flex flex-col items-center space-y-1 group cursor-pointer">
                  <div className="w-full bg-green-500 hover:bg-green-600 rounded-t transition-all duration-300 group-hover:shadow-lg" style={{ height: '36px' }} title="Revenue: ETB 12,500"></div>
                  <div className="w-full bg-orange-400 hover:bg-orange-500 rounded-t transition-all duration-300 group-hover:shadow-lg" style={{ height: '27px' }} title="Orders: 45"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">Mon</span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">12.5k</span>
                </div>
                
                {/* Tuesday */}
                <div className="flex flex-col items-center space-y-1 group cursor-pointer">
                  <div className="w-full bg-green-500 hover:bg-green-600 rounded-t transition-all duration-300 group-hover:shadow-lg" style={{ height: '48px' }} title="Revenue: ETB 18,200"></div>
                  <div className="w-full bg-orange-400 hover:bg-orange-500 rounded-t transition-all duration-300 group-hover:shadow-lg" style={{ height: '39px' }} title="Orders: 62"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">Tue</span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">18.2k</span>
                </div>
                
                {/* Wednesday */}
                <div className="flex flex-col items-center space-y-1 group cursor-pointer">
                  <div className="w-full bg-green-500 hover:bg-green-600 rounded-t transition-all duration-300 group-hover:shadow-lg" style={{ height: '42px' }} title="Revenue: ETB 15,800"></div>
                  <div className="w-full bg-orange-400 hover:bg-orange-500 rounded-t transition-all duration-300 group-hover:shadow-lg" style={{ height: '33px' }} title="Orders: 54"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">Wed</span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">15.8k</span>
                </div>
                
                {/* Thursday */}
                <div className="flex flex-col items-center space-y-1 group cursor-pointer">
                  <div className="w-full bg-green-500 hover:bg-green-600 rounded-t transition-all duration-300 group-hover:shadow-lg" style={{ height: '54px' }} title="Revenue: ETB 22,100"></div>
                  <div className="w-full bg-orange-400 hover:bg-orange-500 rounded-t transition-all duration-300 group-hover:shadow-lg" style={{ height: '45px' }} title="Orders: 78"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">Thu</span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">22.1k</span>
                </div>
                
                {/* Friday */}
                <div className="flex flex-col items-center space-y-1 group cursor-pointer">
                  <div className="w-full bg-green-500 hover:bg-green-600 rounded-t transition-all duration-300 group-hover:shadow-lg" style={{ height: '51px' }} title="Revenue: ETB 19,500"></div>
                  <div className="w-full bg-orange-400 hover:bg-orange-500 rounded-t transition-all duration-300 group-hover:shadow-lg" style={{ height: '42px' }} title="Orders: 68"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">Fri</span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">19.5k</span>
                </div>
                
                {/* Saturday - Highest */}
                <div className="flex flex-col items-center space-y-1 group cursor-pointer">
                  <div className="w-full bg-green-500 hover:bg-green-600 rounded-t transition-all duration-300 group-hover:shadow-lg shadow-green-200 dark:shadow-green-800" style={{ height: '60px' }} title="Revenue: ETB 25,300"></div>
                  <div className="w-full bg-orange-400 hover:bg-orange-500 rounded-t transition-all duration-300 group-hover:shadow-lg shadow-orange-200 dark:shadow-orange-800" style={{ height: '51px' }} title="Orders: 89"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">Sat</span>
                  <span className="text-xs text-green-600 dark:text-green-400 font-semibold">25.3k</span>
                </div>
                
                {/* Sunday */}
                <div className="flex flex-col items-center space-y-1 group cursor-pointer">
                  <div className="w-full bg-green-500 hover:bg-green-600 rounded-t transition-all duration-300 group-hover:shadow-lg" style={{ height: '57px' }} title="Revenue: ETB 21,400"></div>
                  <div className="w-full bg-orange-400 hover:bg-orange-500 rounded-t transition-all duration-300 group-hover:shadow-lg" style={{ height: '48px' }} title="Orders: 74"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">Sun</span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">21.4k</span>
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Revenue</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Orders</span>
              </div>
            </div>
          </div>

          {/* Customer Favorites */}
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer Favorites</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Dynamized personalized chart based on your customer's (Saba K.)
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Top 5 Products</h4>
              
              {/* Pie Chart */}
              <div className="relative w-48 h-48 mx-auto mb-4">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f97316" strokeWidth="20" strokeDasharray="80 100" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20" strokeDasharray="64 100" strokeDashoffset="-80" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="20" strokeDasharray="57 100" strokeDashoffset="-144" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#eab308" strokeWidth="20" strokeDasharray="51 100" strokeDashoffset="-201" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#6b7280" strokeWidth="20" strokeDasharray="45 100" strokeDashoffset="-252" />
                </svg>
              </div>
              
              {/* Legend */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">Doro Wat</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">32%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">Mango Juice</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">20%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">Tuna Pizza</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">18%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">Shiro Tagamino</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">16%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">Other</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">14%</span>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Based on your 15 past orders
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Popular Items Heatmap */}
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Items Heatmap</h3>
            
            <div className="space-y-1">
              {heatmapData.map((row, i) => (
                <div key={i} className="flex items-center space-x-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400 w-8">{row.day}</span>
                  {row.hours.map((value, j) => (
                    <div
                      key={j}
                      className={`w-8 h-6 rounded ${getHeatmapColor(value)}`}
                      title={`${row.day}: ${value} orders`}
                    />
                  ))}
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Product Stock Alerts</h4>
              <div className="space-y-2">
                {stockAlerts.map((alert, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">{alert.name}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      alert.status === 'stock' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Method Usage */}
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Payment Method Usage</h3>
            
            {/* Pie Chart */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f97316" strokeWidth="20" strokeDasharray="56 100" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="20" strokeDasharray="28 100" strokeDashoffset="-56" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20" strokeDasharray="11 100" strokeDashoffset="-84" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#6b7280" strokeWidth="20" strokeDasharray="5 100" strokeDashoffset="-95" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">56%</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Cash</div>
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Telebirr</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">16%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">CBE</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">28%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Awash</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">11%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Cash on Delivery</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">56%</span>
              </div>
            </div>
          </div>

          {/* Feedback Activity */}
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Feedback Activity</h3>
            
            <div className="space-y-3">
              {feedbackActivity.map((feedback, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-dark-700 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{feedback.text}</p>
                  </div>
                  <div className="flex items-center space-x-1 ml-4">
                    <span className={`text-sm font-medium ${
                      feedback.color === 'green' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {feedback.sentiment}
                    </span>
                    <Star size={14} className={feedback.color === 'green' ? 'text-green-500 fill-green-500' : 'text-yellow-500 fill-yellow-500'} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700">
                <Package size={16} className="text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700">
                <TrendingUp size={16} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-dark-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100 text-sm">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100 text-sm">Customer Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100 text-sm">Products</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100 text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100 text-sm">Total (ETB)</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700/50">
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100 text-sm">{order.id}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100 text-sm">{order.customer}</td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{order.product}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{order.description}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100 text-sm font-medium">{order.total}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm">
                          View
                        </button>
                        <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 text-sm">
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
