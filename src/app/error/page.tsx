import { Suspense } from 'react';
import ErrorClient from '../../components/ErrorClient'; // Adjust path if needed

const LoadingFallback = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
    </div>
  );
};

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Suspense fallback={<LoadingFallback />}>
        <ErrorClient />
      </Suspense>
    </div>
  );
};

export default ErrorPage;