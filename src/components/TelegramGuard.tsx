// components/TelegramGuard.tsx
'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import useTelegramInitData from 'src/hooks/useTelegramInitData';
import dynamic from 'next/dynamic';
// import TelegramInitializer from './TelegramInitializer';
const TelegramInitializer = dynamic(() => import('./TelegramInitializer'), {
  ssr: false,
});


export default function TelegramGuard({ children }: { children: ReactNode }) {
  const path = usePathname();
  const initData = useTelegramInitData();
  useEffect(() => {
    console.log("📦 Telegram init data:", initData);
    // You can send this to your server here, if needed
  }, [initData]);
  // console.log(path,"path")
  // If on the error page, just render children without init
  if (path === '/error') return <>{children}</>;
  // Otherwise, run the TelegramInitializer
  return <TelegramInitializer>{children}</TelegramInitializer>;
}
 