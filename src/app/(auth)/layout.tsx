import '../globals.css';
import ProgressBarProvider from '../../components/providers/ProgressBarProvider';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ProgressBarProvider />
      {children}
    </div>
  );
} 