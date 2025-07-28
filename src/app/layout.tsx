import type { Metadata } from 'next';
//import LayoutWrapper from '../components/ui/LayoutWrapper';
import ProgressBarProvider from '../components/providers/ProgressBarProvider';
// import { setWebhook } from 'server/bot/config/setWebhook';

export const metadata: Metadata = {
  title: 'Zipha Dashboard',
  description: 'Modern water droplet morphism dashboard',
}
// app/layout.tsx
import { ReactNode } from 'react';
import "./globals.css";
// import '../types/telegram-webapp.d.ts';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setWebhook } from 'server/bot/config/setWebhook';


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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  
                  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  // Fallback to light mode if error
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen transition-colors duration-300">
        <ProgressBarProvider />
        {children}
      </body>
    </html>
  );
}