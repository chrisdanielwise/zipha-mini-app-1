import { Suspense } from 'react';
import LoginSettingsClient from './LoginSettingsClient';

// A simple loading UI to show while the client component loads
const LoadingFallback = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
    </div>
  );
};

// This is the main Server Component for the /loginsettings route
const LoginSettingsPage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginSettingsClient />
    </Suspense>
  );
};

export default LoginSettingsPage;