
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (callback?: () => void) => void;
  logout: (callback?: () => void) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_AUTH_KEY = 'apex_blogs_auth';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Check auth status on mount
  const router = useRouter();

  useEffect(() => {
    // Check localStorage for auth status
    try {
      const storedAuth = localStorage.getItem(MOCK_AUTH_KEY);
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
      }
    } catch (error) {
      // localStorage might not be available (e.g. SSR, incognito)
      console.warn("Could not access localStorage for auth state:", error);
    }
    setIsLoading(false);
  }, []);

  const login = (callback?: () => void) => {
    setIsAuthenticated(true);
    try {
      localStorage.setItem(MOCK_AUTH_KEY, 'true');
    } catch (error) {
      console.warn("Could not access localStorage for auth state:", error);
    }
    if (callback) callback();
    else router.push('/admin/dashboard');
  };

  const logout = (callback?: () => void) => {
    setIsAuthenticated(false);
     try {
      localStorage.removeItem(MOCK_AUTH_KEY);
    } catch (error) {
      console.warn("Could not access localStorage for auth state:", error);
    }
    if (callback) callback();
    else router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
