import React, { useState } from 'react';
import {SocialLogo } from 'social-logos';
import { 
  ChevronLeft,
  ChevronRight,
  Search, 
  User,
  Menu,
  X
} from 'lucide-react';

// Sidebar Component
const Sidebar = ({ currentPage, setCurrentPage, collapsed, setCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const menuItems = [
    { 
      name: 'Dashboard', 
    },
  ];

  const handleMenuItemClick = (itemId) => {
    setCurrentPage(itemId);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`
          ${collapsed && !isMobileOpen ? 'w-20' : 'w-64'} 
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
          fixed md:relative left-0 h-full bg-gray-800 text-white transition-all duration-300 ease-in-out flex flex-col z-30
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {(!collapsed || isMobileOpen) && <h1 className="text-xl font-bold">MyDashboard</h1>}
          <div className="flex">
            {isMobileOpen && (
              <button 
                onClick={() => setIsMobileOpen(false)} 
                className="p-1 rounded-md hover:bg-gray-700 md:hidden mr-2"
              >
                <X size={20} />
              </button>
            )}
            <button 
              onClick={() => setCollapsed(!collapsed)} 
              className="p-1 rounded-md hover:bg-gray-700 hidden md:block"
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        </div>
        
        <div className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-2 px-3">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`flex items-center w-full p-3 rounded-md hover:bg-gray-700 transition-colors ${
                    currentPage === item.id ? 'bg-gray-700' : ''
                  }`}
                >
                  <span className="text-gray-400">{item.icon}</span>
                  {(!collapsed || isMobileOpen) && <span className="ml-3">{item.name}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
      </div>
    </>
  );
};

// Header Component
const Header = ({ currentUser = "HyperAfnan", setIsMobileOpen }) => {
  const formattedDate = "2025-03-25 17:33:03";
  
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
      <div className="flex items-center">
        <button 
          onClick={() => setIsMobileOpen(true)} 
          className="mr-4 p-1 rounded-md text-gray-700 md:hidden"
        >
          <Menu size={24} />
        </button>
        
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hidden md:block"
          />
          <div className="absolute left-3 top-2.5 text-gray-400 hidden md:block">
            <Search size={18} />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden md:block text-sm text-gray-600">
          <span>{formattedDate} UTC</span>
        </div>
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 mr-2">
            <User size={18} />
          </div>
          <span className="hidden md:inline text-sm font-medium">{currentUser}</span>
        </div>
      </div>
    </header>
  );
};

// Dashboard Content Component
const DashboardContent = () => {
};

// Main Dashboard Component that combines everything
const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Render appropriate content based on current page
  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardContent />;
      case 'analytics':
        return <AnalyticsContent />;
      case 'customers':
        return <CustomersContent />;
      case 'products':
        return <ProductsContent />;
      case 'settings':
        return <SettingsContent />;
      case 'help':
        return <HelpContent />;
      default:
        return <NotFoundContent />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          <Header 
            currentUser="HyperAfnan"
            setIsMobileOpen={setIsMobileOpen}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-4 md:p-6 bg-gray-50">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
