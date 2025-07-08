"use client";

import Link from 'next/link';
import { FC } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import "./globals.css";
const NotFoundPage: FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 p-4">
      <div className="max-w-lg text-center">
        <FaExclamationTriangle className="mx-auto text-red-500 dark:text-red-400 text-6xl mb-4" />
        <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The page you are looking for might have been moved, removed, or might never existed.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;