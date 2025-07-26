import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FaHome, FaUsers, FaCog, FaChartBar, FaSignOutAlt, FaFileInvoice, FaUserCog, FaCreditCard, FaInfoCircle, FaShieldAlt, FaPalette, FaBell, FaUser, FaCrown, FaTags, FaGift, FaTimes, FaUserTie, FaHeadset } from 'react-icons/fa';

const navLinks = [
  { href: '/', label: 'Dashboard', icon: <FaHome /> },
  { href: '/subscribers', label: 'Subscribers', icon: <FaUsers /> },
  { href: '/merchant-dashboard', label: 'Merchant Dashboard', icon: <FaUserTie /> },
  { href: '/csr-dashboard', label: 'CSR Dashboard', icon: <FaHeadset /> },
  { href: '/service', label: 'Services', icon: <FaTags /> },
  { href: '/coupons', label: 'Coupons', icon: <FaGift /> },
  { href: '/analytics', label: 'Analytics', icon: <FaChartBar /> },
  { href: '/settings', label: 'Settings', icon: <FaCog /> },
];

const settingsLinks = [
  { href: '/settings', label: 'General', icon: <FaCog /> },
  { href: '/settings/subscription', label: 'Subscription', icon: <FaCrown /> },
  { href: '/settings/profile', label: 'Profile', icon: <FaUser /> },
  { href: '/settings/dashboard', label: 'Dashboard', icon: <FaHome /> },
  { href: '/settings/payment', label: 'Payment', icon: <FaCreditCard /> },
  { href: '/settings/about', label: 'About', icon: <FaInfoCircle /> },
  { href: '/settings/autologout', label: 'Auto Logout', icon: <FaShieldAlt /> },
  { href: '/settings/login', label: 'Login', icon: <FaUserCog /> },
  { href: '/settings/service', label: 'Service', icon: <FaFileInvoice /> },
  { href: '/settings/deactivate', label: 'Deactivate', icon: <FaShieldAlt /> },
  { href: '/settings/action', label: 'Actions', icon: <FaCog /> },
  { href: '/settings/theme', label: 'Theme', icon: <FaPalette /> },
  { href: '/settings/notifications', label: 'Notifications', icon: <FaBell /> },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Full-Screen Sidebar */}
      <aside 
        className={`fixed inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl z-50 transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
        style={{ touchAction: 'none' }}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-6 py-6">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggle();
              }} 
              className="flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer z-10"
              type="button"
              aria-label="Close sidebar"
            >
              <FaTimes className="text-xl" />
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Handle logout logic here
                console.log('Logout clicked');
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-600/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-600/30 transition z-10"
            >
              <FaSignOutAlt className="text-sm" />
              <span className="text-sm font-medium">Log out</span>
            </button>
          </div>

          {/* Logo Section */}
          <div className="flex flex-col items-center px-6 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-2xl mb-4">
              <span className="text-2xl font-bold text-white relative z-10">Z</span>
            </div>
            <h1 className="text-gray-900 dark:text-white font-bold text-2xl">ZIPHA</h1>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 px-6 space-y-2 overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center w-full px-4 py-4 rounded-2xl transition-all duration-200 font-medium text-base group relative ${
                  isActive(link.href)
                    ? 'bg-blue-50 dark:bg-gray-800/50 text-blue-700 dark:text-white border border-blue-200 dark:border-gray-700/50'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/30 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggle();
                  // Use Next.js router for client-side navigation
                  router.push(link.href);
                }}
              >
                <div className="flex items-center gap-4 w-full">
                  <div className={`text-xl transition-colors duration-200 ${
                    isActive(link.href) ? 'text-blue-600 dark:text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200'
                  }`}>
                    {link.icon}
                  </div>
                  <span className="flex-1">{link.label}</span>
                  {isActive(link.href) && (
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex-shrink-0 shadow-lg shadow-blue-500/30" />
                  )}
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-white/95 dark:bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-xl shadow-2xl border-r border-white/30 dark:border-gray-700/30 z-40 flex-col overflow-y-auto">
        {/* Desktop Logo Section */}
        <div className="flex flex-col items-center py-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg mb-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-2xl" />
            <span className="text-2xl font-bold text-white relative z-10">Z</span>
          </div>
          <span className="text-gray-800 dark:text-white font-bold text-xl">Zipha</span>
          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Dashboard</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="flex-1 w-full px-3 py-4">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">Main</h3>
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center w-full px-3 py-3 rounded-xl transition-all duration-200 font-medium text-sm group relative ${
                  isActive(link.href)
                    ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/20 dark:to-purple-400/20 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-700/50'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`text-lg transition-colors duration-200 ${
                    isActive(link.href) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                  }`}>
                    {link.icon}
                  </div>
                  <span className="flex-1 truncate">{link.label}</span>
                  {isActive(link.href) && (
                    <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full flex-shrink-0" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </nav>

        {/* Bottom spacing */}
        <div className="h-4"></div>
      </aside>
    </>
  );
} 