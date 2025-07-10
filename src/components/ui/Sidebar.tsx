import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaUsers, FaCog, FaChartBar, FaSignOutAlt, FaFileInvoice, FaUserCog, FaCreditCard, FaInfoCircle, FaShieldAlt, FaPalette, FaBell, FaUser, FaCrown, FaTags, FaGift } from 'react-icons/fa';

const navLinks = [
  { href: '/', label: 'Dashboard', icon: <FaHome /> },
  { href: '/subscribers', label: 'Subscribers', icon: <FaUsers /> },
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

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-screen w-64 bg-white/90 dark:bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-xl shadow-2xl border-r border-white/30 dark:border-gray-700/30 flex flex-col items-center py-6 z-40 transition-all duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:top-0 top-16`}>
        
        {/* Logo Section */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg mb-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-2xl" />
            <span className="text-2xl font-bold text-white relative z-10">Z</span>
          </div>
          <span className="text-gray-800 dark:text-white font-bold text-xl">Zipha</span>
          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Dashboard</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 w-full flex flex-col gap-1 px-3">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-3">Main</h3>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl transition-all duration-200 font-medium text-sm group relative overflow-hidden ${
                  isActive(link.href)
                    ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/20 dark:to-purple-400/20 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-700/50'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    onToggle();
                  }
                }}
              >
                <div className={`text-lg transition-colors duration-200 ${
                  isActive(link.href) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                }`}>
                  {link.icon}
                </div>
                <span>{link.label}</span>
                {isActive(link.href) && (
                  <div className="absolute right-2 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Settings Section */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-3">Settings</h3>
            <div className="space-y-1">
              {settingsLinks.slice(0, 6).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all duration-200 font-medium text-xs group ${
                    isActive(link.href)
                      ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-400/20 dark:to-emerald-400/20 text-green-600 dark:text-green-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/60 dark:hover:bg-gray-800/60 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      onToggle();
                    }
                  }}
                >
                  <div className={`text-sm transition-colors duration-200 ${
                    isActive(link.href) ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400'
                  }`}>
                    {link.icon}
                  </div>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Logout Section */}
        <div className="w-full px-3">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent mb-4" />
          <button className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 text-red-600 dark:text-red-400 font-medium text-sm group">
            <FaSignOutAlt className="text-lg group-hover:scale-110 transition-transform duration-200" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
} 