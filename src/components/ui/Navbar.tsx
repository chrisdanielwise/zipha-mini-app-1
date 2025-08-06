import { FaBell, FaBars, FaSun, FaMoon, FaSignOutAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';

interface NavbarProps {
  onMenuToggle: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Sync with already initialized theme (no flashing)
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);

    // Listen for theme changes from other components
    const observer = new MutationObserver(() => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="fixed top-0 w-full h-16 bg-white/95 dark:bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between px-4 md:px-6 z-50 overflow-visible">
      {/* Left side - Logo and mobile menu */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button - only on mobile */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <FaBars className="text-xl text-gray-700 dark:text-gray-300" />
        </button>

        <span className="text-2xl font-bold text-gray-800 dark:text-white">Zipha</span>
        <span className="ml-4 text-lg font-semibold text-gray-600 dark:text-gray-300 hidden sm:inline">Dashboard</span>
      </div>
      
      {/* Right side - Theme, notifications, logout, profile */}
      <div className="flex items-center gap-2 sm:gap-4">

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center justify-center"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <FaSun className="text-lg text-yellow-500" />
          ) : (
            <FaMoon className="text-lg text-gray-700" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center justify-center">
          <FaBell className="text-lg text-gray-700 dark:text-gray-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Desktop Logout Button */}
        <button 
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all duration-200 font-medium text-sm"
          onClick={() => {
            // Handle logout logic here
            console.log('Logout clicked');
          }}
        >
          <FaSignOutAlt className="text-sm" />
          <span>Logout</span>
        </button>

        {/* User Profile */}
        <div className="relative group">
          <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg hover:shadow-xl transition flex-shrink-0">
            <span className="text-sm sm:text-lg font-bold text-white">U</span>
          </button>
          <div className="absolute right-0 top-full mt-2 w-48 sm:w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">admin@zipha.com</p>
            </div>
            <div className="py-2">
              <a href="/userprofile" className="block px-3 sm:px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                Profile Settings
              </a>
              <a href="/settings" className="block px-3 sm:px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                Account Settings
              </a>
              <a href="/paymentsettings" className="block px-3 sm:px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                Payment Settings
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 