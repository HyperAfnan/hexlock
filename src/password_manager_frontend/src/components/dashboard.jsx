import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Menu,
  X,
  LogOut,
  Eye,
  EyeOff,
  RefreshCw,
  Sun,
  Moon,
} from "lucide-react";

const shortenPrincipalId = (principalId) => {
  if (!principalId) return "";
  return `${principalId.substring(0, 7)}...${principalId.substring(
    principalId.length - 7
  )}`;
};

const Sidebar = ({ currentPage, setCurrentPage, collapsed, setCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: <User size={20} className="text-gray-300" /> },
    { id: "new", name: "New", icon: <User size={20} className="text-gray-300" /> },
  ];

  const handleMenuItemClick = (itemId) => {
    setCurrentPage(itemId);
    if (window.innerWidth < 768) setIsMobileOpen(false);
  };

  return (
    <>
      {isMobileOpen && <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20" onClick={() => setIsMobileOpen(false)}></div>}
      <div className={`${collapsed && !isMobileOpen ? "w-20" : "w-64"} ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} fixed md:relative left-0 h-full bg-gradient-to-b from-gray-800 to-gray-900 text-white transition-all duration-300 ease-in-out flex flex-col z-30`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {(!collapsed || isMobileOpen) && <h1 className="text-xl font-bold text-gray-200">HexLock</h1>}
          <div className="flex">
            {isMobileOpen && <button onClick={() => setIsMobileOpen(false)} className="p-1 rounded-md hover:bg-gray-700 md:hidden mr-2"><X size={20} /></button>}
            <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded-md hover:bg-gray-700 hidden md:block">{collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}</button>
          </div>
        </div>
        <div className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button onClick={() => handleMenuItemClick(item.id)} className={`flex items-center w-full p-3 rounded-md hover:bg-gray-700 transition-colors ${currentPage === item.id ? "bg-gray-700" : ""}`}>
                  <span>{item.icon}</span>
                  {(!collapsed || isMobileOpen) && <span className="ml-3 text-gray-300">{item.name}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

const LoginCard = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const generateRandomPassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let newPassword = "";
    for (let i = 0; i < length; i++) {
      newPassword += charset[Math.floor(Math.random() * charset.length)];
    }
    setPassword(newPassword);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
      <div className="relative w-full max-w-lg mx-auto bg-gradient-to-b from-gray-800 to-gray-900 text-white rounded-lg shadow-lg overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"><X size={20} /></button>
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800">
          <h2 className="text-2xl font-bold text-center">Add Password</h2>
        </div>
        <div className="p-8 space-y-6">
          <input type="text" placeholder="Name" className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border-gray-600" />
          <input type="text" placeholder="Username" className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border-gray-600" />
          <input type="text" placeholder="URL" className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border-gray-600" />
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border-gray-600 pr-20" />
            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-10 top-3 text-gray-300">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
            <button onClick={generateRandomPassword} className="absolute right-3 top-3 text-gray-300"><RefreshCw size={20} /></button>
          </div>
          <button className="w-full py-3 rounded-md bg-blue-700 text-white hover:bg-blue-600">Add</button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ identity }) => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} collapsed={false} setCollapsed={() => {}} isMobileOpen={false} setIsMobileOpen={() => {}} />
      <div className="flex-1 flex flex-col">
        <button onClick={() => setIsLoginOpen(true)} className="p-3 m-4 bg-blue-600 text-white rounded">New</button>
        {isLoginOpen && <LoginCard onClose={() => setIsLoginOpen(false)} />}
      </div>
    </div>
  );
};

export default Dashboard;
