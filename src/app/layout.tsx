import './globals.css';
import type { Metadata } from 'next';
import LayoutWrapper from '../components/ui/LayoutWrapper';

export const metadata: Metadata = {
  title: 'Zipha Dashboard',
  description: 'Modern water droplet morphism dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen transition-colors duration-300">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}