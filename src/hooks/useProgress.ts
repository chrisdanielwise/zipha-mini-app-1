import React, { useCallback } from 'react';

export interface ProgressControls {
  start: () => void;
  finish: () => void;
  set: (progress: number) => void;
  increment: (amount?: number) => void;
  isStarted: () => boolean;
}

export const useProgress = (): ProgressControls => {
  const start = useCallback(() => {
    // Trigger progress bar by dispatching a custom event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showProgress'));
    }
  }, []);

  const finish = useCallback(() => {
    // Hide progress bar by dispatching a custom event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hideProgress'));
    }
  }, []);

  const set = useCallback((progress: number) => {
    // For now, just show/hide based on progress
    if (progress >= 1) {
      finish();
    } else if (progress > 0) {
      start();
    }
  }, [start, finish]);

  const increment = useCallback((amount?: number) => {
    // For simplicity, just show progress
    start();
  }, [start]);

  const isStarted = useCallback(() => {
    // Check if progress bar is currently showing
    return false; // We'll implement this if needed
  }, []);

  return {
    start,
    finish,
    set,
    increment,
    isStarted,
  };
};

// Utility function for async operations
export const withProgress = async <T>(
  asyncFn: () => Promise<T>,
  options?: {
    onProgress?: (progress: number) => void;
    steps?: number;
  }
): Promise<T> => {
  const { onProgress, steps = 1 } = options || {};
  
  // Show progress
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('showProgress'));
  }
  
  try {
    if (onProgress && steps > 1) {
      for (let i = 0; i < steps; i++) {
        const progress = (i + 1) / steps;
        onProgress(progress);
      }
    }
    
    const result = await asyncFn();
    
    // Hide progress
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hideProgress'));
    }
    
    return result;
  } catch (error) {
    // Hide progress on error
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hideProgress'));
    }
    throw error;
  }
};

// HOC for wrapping components with progress
export const withProgressBar = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const WithProgressBar = (props: P) => {
    const progress = useProgress();
    
    // Using React.createElement to avoid the TSX type error
    return React.createElement(WrappedComponent, { ...props, progress });
  };

  // Set the display name for easier debugging in React DevTools
  WithProgressBar.displayName = `withProgressBar(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  
  return WithProgressBar;
};