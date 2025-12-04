import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const DashboardNavigation = ({ user }) => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/seed-data', label: 'Seed Data', icon: '🌱' },
    { path: '/firebase-data', label: 'Firebase Data', icon: '🔥' }
  ];

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Navigation</h2>
        <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
      </div>
      
      <nav className="flex space-x-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
          >
            <span>{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default DashboardNavigation;