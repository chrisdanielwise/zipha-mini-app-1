import { Suspense } from 'react';
import LoginForm from './LoginForm';

// A simple loading UI to show while the client component loads
const LoadingFallback = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
        </div>
    );
};

// This is the main server component for the /login route
const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Suspense fallback={<LoadingFallback />}>
        <LoginForm />
      </Suspense>
    </div>
  );
};

export default LoginPage;