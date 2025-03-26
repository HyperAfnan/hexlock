import React, { useState, useEffect } from 'react';
import { Moon, Sun, User } from 'lucide-react';

const Auth = ({ onLogin }) => {
   const [darkMode, setDarkMode] = useState(true);

   // Dark mode effect
   useEffect(() => {
      if (darkMode) {
         document.documentElement.classList.add('dark');
         document.body.style.backgroundColor = '#1a202c';
      } else {
         document.documentElement.classList.remove('dark');
         document.body.style.backgroundColor = '#ffffff';
      }
      
      return () => {
         document.body.style.backgroundColor = '';
      };
   }, [darkMode]);

   const toggleTheme = () => {
      setDarkMode(!darkMode);
   };

   return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
         <div className={`
         w-96 max-w-md p-6 rounded-lg shadow-xl 
         ${darkMode
               ? 'bg-gray-800 text-white'
               : 'bg-white text-gray-800 border border-gray-200'
            }`}
         >
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-semibold">Welcome to HexLock</h2>
               <button
                  onClick={toggleTheme}
                  className={`
              p-2 rounded-full 
              ${darkMode
                        ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                     }`}
               >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
               </button>
            </div>
            <div className="text-sm text-gray-400 mb-6">
               Sign in to access your secure password manager
            </div>
            <div className="flex justify-center mb-6">
               <div className={`
            w-16 h-16 rounded-full flex items-center justify-center 
            ${darkMode
                     ? 'bg-gray-700'
                     : 'bg-gray-100'
                  }`}
               >
                  <User
                     size={32}
                     className={darkMode ? 'text-gray-400' : 'text-gray-600'}
                  />
               </div>
            </div>
            <button
               onClick={onLogin}
               className={`
            w-full py-3 rounded-lg transition-colors duration-300
            ${darkMode
                     ? 'bg-blue-600 text-white hover:bg-blue-700'
                     : 'bg-black text-white hover:bg-gray-800'
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
