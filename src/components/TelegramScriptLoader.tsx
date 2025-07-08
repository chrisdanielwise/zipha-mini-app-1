'use client';
import Script from 'next/script';

export default function TelegramScriptLoader() {
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
