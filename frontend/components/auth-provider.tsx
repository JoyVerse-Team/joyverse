"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, getCurrentUser, isAuthenticated, logout as logoutUtil } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (user: User, token: string, remember?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = () => {
      const currentUser = getCurrentUser();
      const authenticated = isAuthenticated();
      
      if (authenticated && currentUser) {
        setUser(currentUser);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData: User, token: string, remember = false) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('joyverse_user', JSON.stringify(userData));
    storage.setItem('joyverse_token', token);
    setUser(userData);
  };

  const logout = () => {
    logoutUtil();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
