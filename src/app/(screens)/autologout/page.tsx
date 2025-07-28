import { Suspense } from 'react';
import AutoLogoutClient from './AutoLogoutClient';

// A simple loading UI to show while the client component is loading
const LoadingFallback = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
        </div>
    );
};

// This is the main server component for the /autologout route
const AutoLogoutPage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AutoLogoutClient />
    </Suspense>
  );
};

export default AutoLogoutPage;