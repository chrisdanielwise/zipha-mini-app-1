'use client';

import { useEffect } from 'react';

export default function TelegramViewportCSS() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg?.viewportHeight) {
      document.documentElement.style.setProperty('--tg-viewport-height', `${tg.viewportHeight}px`);
      document.documentElement.style.setProperty('--tg-viewport-stable-height', `${tg.viewportStableHeight}px`);
    }
  }, []);

  return null;
}
