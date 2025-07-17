"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, logout as logoutAuth } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // Set loading to false after a short delay to simulate initialization
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const login = (userData: User) => {
    console.log('AuthProvider - login called with:', userData);
    setUser(userData);
    console.log('AuthProvider - user state updated, isAuthenticated should be:', !!userData);
  };

  const logout = async () => {
    try {
      await logoutAuth();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    }
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
