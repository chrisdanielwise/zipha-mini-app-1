import './globals.css';
import type { Metadata } from 'next';
import LayoutWrapper from '../components/ui/LayoutWrapper';
// import { setWebhook } from 'server/bot/config/setWebhook';

export const metadata: Metadata = {
  title: 'Zipha Dashboard',
  description: 'Modern water droplet morphism dashboard',
};

// if (!(global as any).__BOT_INITIALIZED__) {
//   setWebhook() 
//     .then(() => {
//       (global as any).__BOT_INITIALIZED__ = true;
//     })
//     .catch(console.error); // Log errors if any
// } 


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen transition-colors duration-300">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}