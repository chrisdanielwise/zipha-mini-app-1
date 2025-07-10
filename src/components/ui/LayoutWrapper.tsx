"use client";

import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex-1 flex flex-col md:ml-64">
        <Navbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 px-2 sm:px-4 md:px-8 overflow-y-auto mt-16">
          {children}
        </main>
      </div>
    </div>
  );
} 