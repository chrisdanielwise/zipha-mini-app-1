"use client";

import Link from "next/link";
import { 
  Settings as SettingsIcon,
  User,
  Shield,
  CreditCard,
  Bell,
  Palette,
  Building,
  Mail,
  Wifi,
  Power,
  Info,
  ChevronRight,
  Crown,
  Lock,
  Key,
  Database,
  Activity,
  FileText,
  Users,
  Globe
} from "lucide-react";
import WaterDropCard from "../../../components/ui/WaterDropCard";

interface SettingsSection {
  title: string;
  items: {
    href: string;
    label: string;
    description: string;
    icon: React.ReactElement;
    color: string;
  }[];
}

const SettingsPage = () => {
  const settingsSections: SettingsSection[] = [
    {
      title: "Account & Profile",
      items: [
        {
          href: '/settings/profile',
          label: 'Profile Settings',
          description: 'Manage your personal information and preferences',
          icon: <User className="w-5 h-5" />,
          color: 'from-blue-500 to-cyan-600'
        },
        {
          href: '/settings/subscription',
          label: 'Subscription Management',
          description: 'View and manage your subscription plans',
          icon: <Crown className="w-5 h-5" />,
          color: 'from-purple-500 to-pink-600'
        },
        {
          href: '/settings/dashboard',
          label: 'Dashboard Settings',
          description: 'Customize your dashboard layout and widgets',
          icon: <Activity className="w-5 h-5" />,
          color: 'from-green-500 to-emerald-600'
        }
      ]
    },
    {
      title: "Security & Access",
      items: [
        {
          href: '/settings/login',
          label: 'Login Settings',
          description: 'Configure authentication and security options',
          icon: <Lock className="w-5 h-5" />,
          color: 'from-red-500 to-pink-600'
        },
        {
          href: '/settings/payment',
          label: 'Payment Settings',
          description: 'Manage payment methods and billing information',
          icon: <CreditCard className="w-5 h-5" />,
          color: 'from-green-500 to-teal-600'
        },
        {
          href: '/settings/autologout',
          label: 'Auto Logout',
          description: 'Set automatic logout and session management',
          icon: <Shield className="w-5 h-5" />,
          color: 'from-orange-500 to-red-600'
        }
      ]
    },
    {
      title: "Preferences & Notifications",
      items: [
        {
          href: '/settings/theme',
          label: 'Theme & Appearance',
          description: 'Customize colors, themes, and visual preferences',
          icon: <Palette className="w-5 h-5" />,
          color: 'from-indigo-500 to-purple-600'
        },
        {
          href: '/settings/notifications',
          label: 'Notifications',
          description: 'Configure email and push notification settings',
          icon: <Bell className="w-5 h-5" />,
          color: 'from-yellow-500 to-orange-600'
        },
        {
          href: '/settings/service',
          label: 'Service Settings',
          description: 'Manage service integrations and connections',
          icon: <Database className="w-5 h-5" />,
          color: 'from-blue-500 to-indigo-600'
        }
      ]
    },
    {
      title: "Company & System",
      items: [
        {
          href: '/settings/company',
          label: 'Company Information',
          description: 'Update company details and branding',
          icon: <Building className="w-5 h-5" />,
          color: 'from-gray-500 to-gray-600'
        },
        {
          href: '/settings/bulk-message',
          label: 'Bulk Messaging',
          description: 'Configure mass communication settings',
          icon: <Mail className="w-5 h-5" />,
          color: 'from-cyan-500 to-blue-600'
        },
        {
          href: '/settings/actions',
          label: 'System Actions',
          description: 'Manage system-wide actions and permissions',
          icon: <Key className="w-5 h-5" />,
          color: 'from-violet-500 to-purple-600'
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-lg">
          <SettingsIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account and preferences</p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map((item, itemIndex) => (
                <Link key={itemIndex} href={item.href}>
                  <WaterDropCard variant="default" className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {item.label}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                    </div>
                  </WaterDropCard>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Account Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Account Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/settings/deactivate">
            <WaterDropCard variant="default" className="p-6 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer group border-l-4 border-l-red-500">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <Power className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    Deactivate Account
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Temporarily disable your account
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
              </div>
            </WaterDropCard>
          </Link>

          <Link href="/settings/about">
            <WaterDropCard variant="default" className="p-6 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer group border-l-4 border-l-blue-500">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    About & Version
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Version 7.02 - View app information
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </WaterDropCard>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <WaterDropCard variant="default" className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">System Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-2">
              <Wifi className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Online</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">Connected</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-2">
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Users</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">2,350</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mx-auto mb-2">
              <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Storage</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">85%</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mx-auto mb-2">
              <Globe className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">99.9%</p>
          </div>
        </div>
      </WaterDropCard>
    </div>
  );
};

export default SettingsPage;