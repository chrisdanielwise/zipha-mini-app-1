'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface AuthContextType {
  user: TelegramUser | null;
  setUser: (user: TelegramUser | null) => void;
  isLoggedIn: boolean;
}

// 1. Create context
const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isLoggedIn: false,
});

// 2. Hook
export const useAuth = () => useContext(AuthContext);

// 3. Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TelegramUser | null>(null);

// Optional: Load from localStorage (if you want persistence)
//   useEffect(() => {
//     const storedUser = localStorage.getItem('tg_user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

// Optional: Save to localStorage on change
//   useEffect(() => {
//     if (user) {
//       localStorage.setItem('tg_user', JSON.stringify(user));
//     }
//   }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};