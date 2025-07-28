import { Suspense } from 'react';
import ActionClient from '../../../components/ActionClient'; // Adjust path if needed

// This is a simple fallback UI to show while the client component is loading
const LoadingFallback = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
        </div>
    );
};

// This is now the main page, a Server Component
const ActionPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Suspense fallback={<LoadingFallback />}>
        <ActionClient />
      </Suspense>
    </div>
  );
};

export default ActionPage;