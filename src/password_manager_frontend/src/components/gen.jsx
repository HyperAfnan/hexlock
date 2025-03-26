import React, { useState, useEffect } from "react";
import { Eye, EyeOff, RefreshCw, Sun, Moon, X } from "lucide-react";

const LoginCard = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Apply theme to body when theme changes
  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const generateRandomPassword = () => {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let newPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    setPassword(newPassword);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`relative w-full max-w-lg mx-auto bg-gradient-to-b from-gray-800 to-gray-900 text-white rounded-lg shadow-lg overflow-hidden`}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
      >
        <X size={20} />
      </button>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`absolute top-4 left-4 p-2 rounded-full transition-colors duration-300 ${
          isDarkMode
            ? "hover:bg-gray-700 text-white"
            : "hover:bg-gray-200 text-gray-700"
        }`}
      >
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800">
        <h2 className="text-2xl font-bold text-center">Add Password</h2>
      </div>

      <div className="p-8 space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium mb-2 text-gray-300"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            placeholder="Name"
            className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium mb-2 text-gray-300"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="Username"
            className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-2 text-gray-300"
          >
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border-gray-600 pr-20 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="hover:text-gray-400 focus:outline-none text-gray-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <button
                type="button"
                onClick={generateRandomPassword}
                className="hover:text-gray-400 focus:outline-none text-gray-300"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium mb-2 text-gray-300"
          >
            URL
          </label>
          <input
            type="text"
            id="url"
            placeholder="URL"
            className="w-full px-4 py-3 rounded-md bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-md bg-blue-700 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default LoginCard;