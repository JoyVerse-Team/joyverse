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
  useEffect(() => {
    // Check for any stored user in localStorage (for demo/persistence)
    const storedUser = localStorage.getItem('joyverse-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('AuthProvider - Found stored user:', parsedUser);
        setUser(parsedUser);
        setLoading(false);
        return;
      } catch (error) {
        console.error('AuthProvider - Error parsing stored user:', error);
        localStorage.removeItem('joyverse-user');
      }
    }

    // No stored user found
    console.log('AuthProvider - No stored user found');
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    console.log('AuthProvider - login called with:', userData);
    setUser(userData);
    // Store user in localStorage for persistence
    localStorage.setItem('joyverse-user', JSON.stringify(userData));
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
      localStorage.removeItem('joyverse-user');    } catch (error) {
      console.error('Logout error:', error);
      // Even if backend logout fails, clear local state
      setUser(null);
      localStorage.removeItem('joyverse-user');
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
