// MongoDB Backend Authentication utility functions and types
// Removed Firebase - using Node.js/Express backend with MongoDB

export interface User {
  id: string;
  pid?: string;
  name: string;
  email: string;
  role: 'child' | 'therapist' | 'user';
  age?: number;
  gender?: string;
  therapistId?: string;
  organization?: string;
  license?: string;
  experience?: string;
  bio?: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role: 'child' | 'therapist' | 'user';
  age?: number;
  gender?: string;
  therapistUID?: string;
  // Therapist-specific fields
  organization?: string;
  license?: string;
  experience?: string;
  bio?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Login with email and password using MongoDB backend
export const loginWithEmail = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    console.log('loginWithEmail: Attempting MongoDB backend authentication for:', email);
    
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('loginWithEmail: Backend response:', data);
    
    if (!response.ok) {
      console.log('loginWithEmail: Login failed:', data.message);
      return {
        success: false,
        message: data.message || 'Login failed'
      };
    }

    console.log('loginWithEmail: Login successful:', data.user);
    return {
      success: true,
      user: data.user,
      message: data.message || 'Login successful'
    };

  } catch (error: any) {
    console.error('loginWithEmail: Network error - backend may be offline:', error);
    throw error; // Let the caller handle the fallback to demo mode
  }
};

// Signup with email and password using MongoDB backend
export const signupWithEmail = async (signupData: SignupData): Promise<AuthResponse> => {
  try {
    console.log('signupWithEmail: Attempting MongoDB backend signup for:', signupData.email);

    const endpoint = signupData.role === 'therapist' ? '/therapist-signup' : '/signup';
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData),
    });

    const data = await response.json();
    console.log('signupWithEmail: Backend response:', data);
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Signup failed'
      };
    }

    return {
      success: true,
      user: data.user,
      message: data.message || 'Signup successful'
    };

  } catch (error: any) {
    console.error('signupWithEmail: Network error - backend may be offline:', error);
    throw error; // Let the caller handle the fallback to demo mode
  }
};

// Get user profile
export const getUserProfile = async (userId: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to get profile'
      };
    }

    return {
      success: true,
      user: data.user,
      message: 'Profile retrieved successfully'
    };

  } catch (error: any) {
    console.error('getUserProfile: Network error:', error);
    return {
      success: false,
      message: 'Network error. Please try again.'
    };
  }
};

// Logout function (for backend sessions if implemented)
export const logout = async (): Promise<void> => {
  try {
    // If you implement backend sessions, add logout API call here
    console.log('logout: User logged out');
  } catch (error) {
    console.error('logout: Error during logout:', error);
  }
};

// Auth API object for easy access
export const authAPI = {
  login: loginWithEmail,
  signup: signupWithEmail,
  getProfile: getUserProfile,
  logout,
};

// Default export
export default authAPI;
