// src/app/error/page.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaExclamationCircle } from 'react-icons/fa';

export default function ErrorPage() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center min-h-screen bg-water-gradient p-4">
      <div className="max-w-md text-center rounded-3xl bg-glass-gradient shadow-water backdrop-blur-lg border border-white/30 p-8">
        <FaExclamationCircle className="mx-auto text-yellow-500 text-6xl mb-4" />
        <h1 className="text-4xl font-bold text-water-dark mb-2">Oops!</h1>
        <p className="text-lg text-water-dark/80 mb-6">
          Something went wrong while verifying your session.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.refresh()}
            className="px-4 py-2 bg-water-light hover:bg-water-dark text-water-dark hover:text-white rounded-xl font-semibold transition"
          >
            Retry
          </button>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl font-semibold transition"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
