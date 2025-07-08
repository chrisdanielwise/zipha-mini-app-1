import { useEffect, useState } from 'react';
import { TelegramWebApps } from 'telegram-webapps-types';

function useTelegramInitData() {
  const [data, setData] = useState<Partial<TelegramWebApps.WebAppInitData>>({});

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initData) {
      const firstLayerInitData = Object.fromEntries(
        new URLSearchParams(window.Telegram.WebApp.initData)
      );

      const initData: Record<string, any> = {};

      for (const key in firstLayerInitData) {
        try {
          initData[key] = JSON.parse(firstLayerInitData[key]);
        } catch {
          initData[key] = firstLayerInitData[key];
        }
      }

      setData(initData);
    }
  }, []);

  return data;
}

export default useTelegramInitData;