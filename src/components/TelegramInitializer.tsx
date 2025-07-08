'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useAuth } from '@/context/AuthContext';


interface TelegramInitializerProps {
  children: ReactNode;
}

const TelegramInitializer = ({ children }: TelegramInitializerProps) => {
  const router = useRouter();
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuth();

  useEffect(() => {
    const verifyTelegram = async () => {
      if (typeof window === 'undefined') return;

      const checkReady = () => {
        const tg = window.Telegram?.WebApp;
        if (!tg) {
          console.log('⏳ Waiting for Telegram...');
          return setTimeout(checkReady, 200);
        }

        tg.ready();
        let initData = tg.initData;
        const initDataUnsafe = tg.initDataUnsafe;

        if (initDataUnsafe?.user) {
          setUser(initDataUnsafe.user); // 🔥 Set the Telegram user globally
        }

        // Cookie fallback
        if (!initData) {
          initData = Cookies.get('tg_initData') || '';
          console.warn('📦 Used initData from cookie:', initData);
        } else {
          Cookies.set('tg_initData', initData, { expires: 1 / 48 }); // 30 minutes
          console.log('📥 Cached initData');
        }

        if (!initData) {
          setError('initData not found. Please open this app from Telegram.');
          console.error('❌ initData not found');
          return;
        }

        // Backend verification
        fetch('/api/verify-init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData }),
        })
          .then(async (res) => {
            if (!res.ok) throw new Error('Verification failed');
            Cookies.set('tg_verified', 'true');
            setVerified(true);
          })
          .catch((err) => {
            console.error('❌ Verification failed:', err);
            setError('Failed to verify your session. Please try again.');
          });
      };

      checkReady();
    };

    verifyTelegram();
  }, [router, setUser]);

  // if (!verified) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 px-4 text-center text-gray-600 dark:text-gray-400">
  //       <div>
  //         <p className="text-sm">Verifying your Telegram session...</p>
  //         {error && (
  //           <div className="mt-4 text-red-500 text-sm font-medium">{error}</div>
  //         )}
  //       </div>
  //     </div>
  //   );
  // }

  return <>{children}</>;
};

export default TelegramInitializer;