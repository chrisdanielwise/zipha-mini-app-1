import { FaBell, FaBars, FaSun, FaMoon } from 'react-icons/fa';
import { useState, useEffect } from 'react';

interface NavbarProps {
  onMenuToggle: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
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
    <header className="fixed top-0 w-full h-16 bg-white/95 dark:bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between px-4 md:px-6 z-50">
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
      
      {/* Right side - Theme, notifications, profile */}
      <div className="flex items-center gap-4">

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <FaSun className="text-xl text-yellow-500" />
          ) : (
            <FaMoon className="text-xl text-gray-700" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <FaBell className="text-xl text-gray-700 dark:text-gray-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="relative group">
          <button className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg hover:shadow-xl transition">
            <span className="text-lg font-bold text-white">U</span>
          </button>
          <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">admin@zipha.com</p>
            </div>
            <div className="py-2">
              <a href="/userprofile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                Profile Settings
              </a>
              <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                Account Settings
              </a>
              <a href="/paymentsettings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                Payment Settings
              </a>
              <hr className="my-2 border-gray-200 dark:border-gray-700" />
              <button className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 