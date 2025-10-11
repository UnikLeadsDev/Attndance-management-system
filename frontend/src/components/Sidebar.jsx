import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  FileText,
  Calendar,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Menu items configuration
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Employees',
      path: '/admin/employees',
      icon: Users
    },
    {
      name: 'Attendance',
      path: '/admin/attendance',
      icon: ClipboardCheck
    },
    {
      name: 'Leaves',
      path: '/admin/leaves',
      icon: FileText
    },
    {
      name: 'Holidays',
      path: '/admin/holidays',
      icon: Calendar
    }
  ];

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false); // Close sidebar on mobile after navigation
  };

  // Handle logout
  const handleLogout = () => {
    // Clear localStorage token
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.clear(); // Optional: clear all localStorage
    
    // Navigate to login
    navigate('/admin/login');
    
    // Optional: Show toast notification
    console.log('Logged out successfully');
  };

  // Check if current path is active
  const isActive = (path) => location.pathname === path;

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden bg-gray-900 text-white p-2 rounded-md shadow-lg hover:bg-gray-800 transition-all duration-200"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-60 bg-gray-900 flex flex-col justify-between z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Top Section */}
        <div className="flex-1 overflow-y-auto">
          {/* Logo/Title */}
          <div className="px-6 py-6 border-b border-gray-800">
            <h1 className="text-2xl font-bold text-white">Nexarge Admin</h1>
            <p className="text-xs text-gray-400 mt-1">Management Portal</p>
          </div>

          {/* Navigation Menu */}
          <nav className="mt-6 px-3">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <li key={item.path}>
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ${
                        active
                          ? 'bg-gray-800 text-blue-400 border-l-4 border-blue-500 font-semibold'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-blue-300 border-l-4 border-transparent'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="mt-8 px-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-red-400 hover:bg-red-900 hover:text-red-300 transition-all duration-200 border-l-4 border-transparent hover:border-red-500"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Bottom Section - Footer */}
        <div className="px-6 py-4 border-t border-gray-800">
          <p className="text-xs text-gray-400 text-center">
            © 2025 Nexarge Services Pvt. Ltd.
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;