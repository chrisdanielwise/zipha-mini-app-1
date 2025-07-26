import React from 'react';
import { useProgress } from '../../hooks/useProgress';

interface ProgressButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  onAsyncClick?: () => Promise<void>;
  loadingText?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

const ProgressButton: React.FC<ProgressButtonProps> = ({
  loading = false,
  onAsyncClick,
  loadingText = 'Loading...',
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  onClick,
  ...props
}) => {
  const progress = useProgress();
  const [isAsyncLoading, setIsAsyncLoading] = React.useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onAsyncClick) {
      setIsAsyncLoading(true);
      progress.start();
      
      try {
        await onAsyncClick();
        progress.finish();
      } catch (error) {
        progress.finish();
        throw error;
      } finally {
        setIsAsyncLoading(false);
      }
    } else if (onClick) {
      onClick(e);
    }
  };

  const isLoading = loading || isAsyncLoading;
  
  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl';
      case 'secondary':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600';
      case 'danger':
        return 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl';
      case 'success':
        return 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl';
      default:
        return 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl';
    }
  };

  // Size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2.5 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2.5 text-sm';
    }
  };

  const baseStyles = 'font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  
  return (
    <button
      {...props}
      className={`${baseStyles} ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      disabled={disabled || isLoading}
      onClick={handleClick}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default ProgressButton; 