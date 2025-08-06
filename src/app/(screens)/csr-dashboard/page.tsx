import { Suspense } from "react";
import CSRDashboardClient from "./CSRDashboardClient";

// A simple loading UI to show while the client component loads
const LoadingFallback = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
    </div>
  );
};

// This is the main server component for the /csr-dashboard route
const CSRDashboard = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CSRDashboardClient />
    </Suspense>
  );
};

export default CSRDashboard; 