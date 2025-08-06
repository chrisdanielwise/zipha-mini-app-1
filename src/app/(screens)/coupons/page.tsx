import { Suspense } from "react";
import CouponsClient from "./CouponsClient";

// A simple loading UI to show while the client component loads
const LoadingFallback = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
    </div>
  );
};

// This is the main server component for the /coupons route
const CouponsPage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CouponsClient />
    </Suspense>
  );
};

export default CouponsPage;
      