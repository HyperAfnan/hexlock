import React, { useState } from 'react';
import { 
  ChevronLeft,
  ChevronRight,
  User,
  Menu,
  X,
  LogOut
} from 'lucide-react';

// Helper function to shorten principal ID
const shortenPrincipalId = (principalId) => {
  if (!principalId) return "";
  return `${principalId.substring(0, 7)}...${principalId.substring(principalId.length - 7)}`;
};

// Sidebar Component
const Sidebar = ({ currentPage, setCurrentPage, collapsed, setCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const menuItems = [
    { 
      id: 'dashboard',
      name: 'Dashboard',
      icon: <User size={20} className="text-gray-400" />
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
          {(!collapsed || isMobileOpen) && <h1 className="text-xl font-bold">HexLock</h1>}
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
                  <span>{item.icon}</span>
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
const Header = ({ identity, setIsMobileOpen, onLogout }) => {
  const principalId = identity ? identity.getPrincipal().toString() : "";
  const shortenedId = shortenPrincipalId(principalId);
  
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
      <div className="flex items-center">
        <button 
          onClick={() => setIsMobileOpen(true)} 
          className="mr-4 p-1 rounded-md text-gray-700 md:hidden"
        >
          <Menu size={24} />
        </button>
        
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 mr-2">
            <User size={18} />
          </div>
          <span className="hidden md:inline text-sm font-medium cursor-default font-mono">{shortenedId}</span>
          <button 
            onClick={onLogout}
            className="ml-2 p-2 rounded-md text-red-600 hover:bg-gray-100"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

// Dashboard Content Component
const DashboardContent = ({ identity }) => {
  // Extract principal ID from identity for display
  const principalId = identity ? identity.getPrincipal().toString() : "";
  
  // Display full principal ID for reference
  const shortenedUsername = shortenPrincipalId(principalId);

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, {shortenedUsername}</h2>
        <p className="text-gray-600 mb-4">
          Your blockchain-based password manager is ready to use. All your passwords are encrypted and stored securely.
        </p>
        <div className="bg-gray-100 p-3 rounded-md">
          <p className="text-sm text-gray-500 mb-1">Your Principal ID:</p>
          <p className="text-gray-700 font-mono break-all">{principalId}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-3">Recent Activities</h3>
          <div className="text-gray-500 text-sm">
            <p>No recent activities to display</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-3">Password Statistics</h3>
          <div className="text-gray-500 text-sm">
            <p>You have 0 passwords stored</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component that combines everything
const Dashboard = ({ identity, onLogout }) => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Render appropriate content based on current page
  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardContent identity={identity} />;
      default:
        return <div className="p-4">Page not found</div>;
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
            identity={identity}
            setIsMobileOpen={setIsMobileOpen}
            onLogout={onLogout}
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
