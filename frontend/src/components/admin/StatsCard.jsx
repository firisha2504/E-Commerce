import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, change, changeType, icon: Icon, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  };

  const bgColorClass = colorClasses[color] || colorClasses.primary;

  return (
    <div className="stat-card">
      <div className="flex items-center">
        <div className={`p-3 rounded-xl ${bgColorClass} text-white`}>
          <Icon size={24} />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
      
      {change && (
        <div className="flex items-center mt-4">
          {changeType === 'increase' ? (
            <TrendingUp className="text-green-500" size={16} />
          ) : (
            <TrendingDown className="text-red-500" size={16} />
          )}
          <span className={`ml-1 text-sm font-medium ${
            changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {change}
          </span>
          <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;