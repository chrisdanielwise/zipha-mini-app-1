import React, { useCallback } from 'react';
import NProgress from 'nprogress';

export interface ProgressControls {
  start: () => void;
  finish: () => void;
  set: (progress: number) => void;
  increment: (amount?: number) => void;
  isStarted: () => boolean;
}

export const useProgress = (): ProgressControls => {
  const start = useCallback(() => {
    NProgress.start();
  }, []);

  const finish = useCallback(() => {
    NProgress.done();
  }, []);

  const set = useCallback((progress: number) => {
    const normalizedProgress = Math.max(0, Math.min(1, progress));
    NProgress.set(normalizedProgress);
  }, []);

  const increment = useCallback((amount?: number) => {
    NProgress.inc(amount);
  }, []);

  const isStarted = useCallback(() => {
    return NProgress.isStarted();
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
  
  NProgress.start();
  
  try {
    if (onProgress && steps > 1) {
      for (let i = 0; i < steps; i++) {
        const progress = (i + 1) / steps;
        onProgress(progress);
        NProgress.set(progress * 0.9);
      }
    }
    
    const result = await asyncFn();
    NProgress.done();
    return result;
  } catch (error) {
    NProgress.done();
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