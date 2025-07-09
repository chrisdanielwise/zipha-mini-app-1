// app/layout.tsx
import { ReactNode } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Script from 'next/script';
import "./globals.css";
import TelegramGuard from 'src/components/TelegramGuard';
import TelegramScriptLoader from 'src/components/TelegramScriptLoader';
import { AuthProvider } from './context/AuthContext';
// import '../types/telegram-webapp.d.ts';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setWebhook } from 'server/bot/config/setWebhook';

export const metadata = {
  title: 'Your App Title',
  description: 'Your app description', 
};

if (!(global as any).__BOT_INITIALIZED__) {
  setWebhook() 
    .then(() => {
      (global as any).__BOT_INITIALIZED__ = true;
    })
    .catch(console.error); // Log errors if any
} 

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" >

      <body>
          <TelegramScriptLoader />
            <AuthProvider>
              <ThemeProvider>
                {/* <TelegramViewportCSS /> */}
                <TelegramGuard>
                  <div className="dash">{children}</div>
                  <ToastContainer 
                    position="top-center" 
                    autoClose={3000} 
                    theme="dark"
                    pauseOnHover
                  />
                </TelegramGuard>
              </ThemeProvider>
            </AuthProvider>
      </body>
    </html>
  );
}