import { ReactNode } from 'react';

export { default as Card } from './Card';

export default function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl bg-glass-gradient shadow-water backdrop-blur-lg border border-white/30 p-6 ${className}`}>
      {children}
    </div>
  );
} 