"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, logout as logoutAuth } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (userData: User) => void;
  loginDemo: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (userData: User) => {
    console.log('AuthProvider - login called with:', userData);
    setUser(userData);
    console.log('AuthProvider - user state updated, isAuthenticated should be:', !!userData);
  };

  const loginDemo = () => {
    const demoUser: User = {
      id: 'demo-child-' + Date.now(),
      name: 'Demo Child',
      email: 'demo@joyverse.com',
      role: 'child'
    };
    login(demoUser);
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
    loginDemo,
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
