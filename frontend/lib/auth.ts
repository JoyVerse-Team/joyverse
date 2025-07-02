// Authentication utility functions and types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'therapist';
  // Additional fields for users
  pid?: string;
  age?: number;
  gender?: string;
  therapistId?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('joyverse_token') || sessionStorage.getItem('joyverse_token');
  return !!token;
};

// Get current user from storage
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('joyverse_user') || sessionStorage.getItem('joyverse_user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

// Get auth token
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem('joyverse_token') || sessionStorage.getItem('joyverse_token');
};

// Logout user
export const logout = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('joyverse_user');
  localStorage.removeItem('joyverse_token');
  sessionStorage.removeItem('joyverse_user');
  sessionStorage.removeItem('joyverse_token');
};

// API base configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// API call wrapper with auth
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Auth API functions
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        return {
          success: true,
          user: data.user,
          token: `auth_${data.user.id}_${Date.now()}` // Simple token generation
        };
      } else {
        return {
          success: false,
          message: data.message || 'Login failed'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.'
      };
    }
  },

  signup: async (userData: {
    name: string;
    email: string;
    password: string;
    age: number;
    gender: string;
    therapistUID: string;
  }): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        return {
          success: true,
          user: data.user,
          message: data.message || 'Account created successfully!'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Signup failed'
        };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.'
      };
    }
  },

  forgotPassword: async (email: string): Promise<AuthResponse> => {
    // This can be implemented later if needed
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Password reset functionality will be available soon.'
        });
      }, 1000);
    });
  },

  verifyEmail: async (token: string): Promise<AuthResponse> => {
    // This can be implemented later if needed
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Email verification functionality will be available soon.'
        });
      }, 1000);
    });
  }
};
