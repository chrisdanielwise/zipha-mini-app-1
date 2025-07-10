"use client";

import Link from 'next/link';
import { FC } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFoundPage: FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-water-gradient p-4">
      <div className="max-w-lg text-center rounded-3xl bg-glass-gradient shadow-water backdrop-blur-lg border border-white/30 p-8">
        <FaExclamationTriangle className="mx-auto text-red-500 text-6xl mb-4" />
        <h1 className="text-5xl font-bold text-water-dark mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-water-dark/90 mb-4">
          Page Not Found
        </h2>
        <p className="text-water-dark/80 mb-6">
          The page you are looking for might have been moved, removed, or might never existed.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-water-light hover:bg-water-dark text-water-dark hover:text-white font-semibold rounded-xl transition focus:outline-none focus:ring-2 focus:ring-water-light"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;