'use client';
import Script from 'next/script';
import { useEffect } from 'react';

export default function TelegramScriptLoader() {
  useEffect(() => {
    // Initialize bot when component mounts
    const initBot = async () => {
      try {
        const response = await fetch('/api/bot/init');
        if (response.ok) {
          console.log('✅ Bot initialized successfully');
        } else {
          console.warn('⚠️ Bot initialization failed:', await response.text());
        }
      } catch (error) {
        console.error('❌ Error initializing bot:', error);
      }
    };

    initBot();
  }, []);

  return (
    <Script
      src="https://telegram.org/js/telegram-web-app.js"
      strategy="afterInteractive"
      onLoad={() => {
        console.log(window,"✅ Telegram WebApp script loaded (client component)");
      }}
      onError={(e) => {
        console.error("❌ Failed to load Telegram WebApp script", e);
      }}
    />
  );
}
