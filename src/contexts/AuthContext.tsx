import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../services/api';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  userType: 'individual' | 'startup' | 'enterprise';
  subscription: 'free' | 'pro' | 'enterprise';
  preferences: {
    notifications: {
      email: boolean;
      deadline: boolean;
      risk: boolean;
    };
    theme: 'light' | 'dark' | 'auto';
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    company?: string;
    userType?: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: any) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (apiService.isAuthenticated()) {
          const response = await apiService.getCurrentUser();
          if (response.success) {
            setUser(response.data.user);
          } else {
            apiService.clearToken();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        apiService.clearToken();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password);
      if (response.success) {
        setUser(response.data.user);
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    company?: string;
    userType?: string;
  }) => {
    try {
      const response = await apiService.register(userData);
      if (response.success) {
        setUser(response.data.user);
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    apiService.clearToken();
    setUser(null);
  };

  const updateProfile = async (profileData: any) => {
    try {
      const response = await apiService.updateProfile(profileData);
      if (response.success) {
        setUser(response.data.user);
      } else {
        throw new Error('Profile update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
