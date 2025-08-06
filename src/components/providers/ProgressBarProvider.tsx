"use client";

import { useEffect, useState } from 'react';

export default function ProgressBarProvider() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      // Only trigger for internal links
      if (link && link.href && link.href.startsWith(window.location.origin)) {
        setIsLoading(true);
        
        // Complete after a short delay
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    };

    // Listen for custom progress events from useProgress hook
    const handleShowProgress = () => {
      setIsLoading(true);
    };

    const handleHideProgress = () => {
      setIsLoading(false);
    };

    // Listen for click events on links
    document.addEventListener('click', handleLinkClick);
    
    // Listen for custom progress events
    window.addEventListener('showProgress', handleShowProgress);
    window.addEventListener('hideProgress', handleHideProgress);

    return () => {
      document.removeEventListener('click', handleLinkClick);
      window.removeEventListener('showProgress', handleShowProgress);
      window.removeEventListener('hideProgress', handleHideProgress);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-[9999]">
      <div 
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-800 ease-out"
        style={{
          width: '100%',
          animation: 'progress 1.5s ease-in-out infinite'
        }}
      />
      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
} 