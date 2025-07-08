// src/app/error/page.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaExclamationCircle } from 'react-icons/fa';

export default function ErrorPage() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md text-center">
        <FaExclamationCircle className="mx-auto text-yellow-500 dark:text-yellow-400 text-6xl mb-4" />
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">Oops!</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Something went wrong while verifying your session.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Retry
          </button>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
