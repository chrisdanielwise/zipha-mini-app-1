import { ReactNode } from 'react';

interface WaterDropCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'floating';
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function WaterDropCard({ children, className = "", variant = 'default', onMouseEnter, onMouseLeave }: WaterDropCardProps) {
  const baseClasses = "rounded-3xl backdrop-blur-md border border-white/30 dark:border-white/10 relative overflow-hidden transition-all duration-300";
  
  const variantClasses = {
    default: "bg-white/85 dark:bg-gray-800/25 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
    elevated: "bg-white/92 dark:bg-gray-800/35 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transform hover:scale-105 transition-transform duration-300",
    floating: "bg-white/96 dark:bg-gray-800/45 shadow-[0_20px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transform hover:-translate-y-2 transition-all duration-300"
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Water droplet highlight effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent dark:from-white/10 rounded-3xl pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  );
} 