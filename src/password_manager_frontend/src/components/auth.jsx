import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Moon, Sun, User } from "lucide-react";
import { AuthClient } from "@dfinity/auth-client"; // Import AuthClient

const Auth = ({ onLogin }) => {
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#1a202c";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#ffffff";
    }

    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleLoginWithInternetIdentity = async () => {
    try {
      const authClient = await AuthClient.create(); // Create an AuthClient instance

      await authClient.login({
        identityProvider: "https://identity.ic0.app", // Internet Identity URL
        onSuccess: () => {
          const identity = authClient.getIdentity(); // Get the authenticated identity
          console.log("Logged in with principal:", identity.getPrincipal().toText());
          onLogin(identity); // Pass the identity to the parent component
          navigate("/dashboard"); // Redirect to the Dashboard component
        },
        onError: (error) => {
          console.error("Login failed:", error);
        },
      });
    } catch (error) {
      console.error("Error initializing AuthClient:", error);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div
        className={`w-96 max-w-md p-6 rounded-lg shadow-xl ${
          darkMode
            ? "bg-gray-800 text-white"
            : "bg-white text-gray-800 border border-gray-200"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Welcome to HexLock</h2>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <div className="text-sm text-gray-400 mb-6">
          Sign in to access your secure password manager
        </div>
        <div className="flex justify-center mb-6">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <User
              size={32}
              className={darkMode ? "text-gray-400" : "text-gray-600"}
            />
          </div>
        </div>
        <button
          onClick={handleLoginWithInternetIdentity} // Attach the login handler
          className={`w-full py-3 rounded-lg transition-colors duration-300 ${
            darkMode
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          Login with Internet Identity
        </button>
        <div className="text-xs text-center text-gray-400 mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
};

export default Auth;