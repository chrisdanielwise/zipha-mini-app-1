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
    // Ensure progress is between 0 and 1
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
      // For multi-step operations
      for (let i = 0; i < steps; i++) {
        const progress = (i + 1) / steps;
        onProgress(progress);
        NProgress.set(progress * 0.9); // Keep some progress for completion
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
export const withProgressBar = function<P extends object>(
  Component: React.ComponentType<P>
) {
  return function(props: P) {
    const progress = useProgress();
    
    return React.createElement(Component, { ...props, progress });
  };
}; 