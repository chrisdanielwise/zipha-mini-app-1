"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  speed: 400,
  minimum: 0.08,
  easing: 'ease',
  positionUsing: '',
  trickleSpeed: 200,
});

// Custom CSS for the progress bar
const progressBarStyles = `
  /* Progress Bar Styles */
  #nprogress {
    pointer-events: none;
  }

  #nprogress .bar {
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    border-radius: 0 0 2px 2px;
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  }

  #nprogress .peg {
    display: block;
    position: absolute;
    right: 0px;
    width: 100px;
    height: 100%;
    box-shadow: 0 0 10px #3b82f6, 0 0 5px #3b82f6;
    opacity: 1.0;
    transform: rotate(3deg) translate(0px, -4px);
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    #nprogress .bar {
      background: linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6);
      box-shadow: 0 0 10px rgba(96, 165, 250, 0.5);
    }
    
    #nprogress .peg {
      box-shadow: 0 0 10px #60a5fa, 0 0 5px #60a5fa;
    }
  }

  /* Loading animation */
  @keyframes nprogress-spinner {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default function ProgressBarProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Inject custom styles
    const styleElement = document.createElement('style');
    styleElement.innerHTML = progressBarStyles;
    document.head.appendChild(styleElement);

    return () => {
      // Cleanup styles on unmount
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  useEffect(() => {
    // Start progress bar
    NProgress.start();
    
    // Complete progress bar after a short delay to show the animation
    const timer = setTimeout(() => {
      NProgress.done();
    }, 100);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname, searchParams]);

  // Handle manual progress control for forms and API calls
  useEffect(() => {
    // Add global functions to control progress bar
    (window as any).startProgress = () => NProgress.start();
    (window as any).finishProgress = () => NProgress.done();
    (window as any).setProgress = (progress: number) => NProgress.set(progress);
    (window as any).incrementProgress = (amount?: number) => NProgress.inc(amount);

    return () => {
      // Cleanup global functions
      delete (window as any).startProgress;
      delete (window as any).finishProgress;
      delete (window as any).setProgress;
      delete (window as any).incrementProgress;
    };
  }, []);

  return null;
} 