import { Suspense } from 'react';
import AnalyticsClient from './AnalyticsClient';

// A simple loading UI to show while the client component is loading
const LoadingFallback = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
    </div>
  );
};

// This is the main server component for the /analytics route
const AnalyticsPage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AnalyticsClient />
    </Suspense>
  );
};

export default AnalyticsPage;