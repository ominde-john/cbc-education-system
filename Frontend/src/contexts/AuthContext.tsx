import { useState, useRef, createContext, useContext, ReactNode, useEffect } from 'react';
import { User, UserRole } from '@/types';

// Use environment variable for API URL, fallback to relative path for development
// In production, set VITE_API_URL to your backend URL (e.g., https://cbc-education-system-1.onrender.com)
// Use empty string (relative path) in development to leverage Vite proxy
// Production fallback: Use Render backend URL when deployed on Vercel
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://cbc-education-system-1.onrender.com' : '');

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  showLoginSkeleton: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN_KEY = 'cbc_access_token';
const REFRESH_TOKEN_KEY = 'cbc_refresh_token';
const USER_KEY = 'cbc_user';
const LOGIN_SKELETON_DURATION_MS = 3000;

const getStoredTokens = () => {
  try {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    const user = userStr ? JSON.parse(userStr) : null;
    return { accessToken, refreshToken, user };
  } catch {
    return { accessToken: null, refreshToken: null, user: null };
  }
};

const saveTokens = (accessToken: string, refreshToken: string, user: User) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginSkeleton, setShowLoginSkeleton] = useState(false);
  const skeletonTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const { user: storedUser } = getStoredTokens();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Session initialization error:', error);
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();

    return () => {
      if (skeletonTimerRef.current) clearTimeout(skeletonTimerRef.current);
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || 'Invalid credentials. Please try again.');
      }

      const userData = data.data?.user || data.user || data.data || {};
      // Backend returns: { success: true, data: { user: {...}, tokens: { accessToken, refreshToken } } }
      const token = data.data?.tokens?.accessToken || data.data?.accessToken || data.token || '';
      const refreshToken = data.data?.tokens?.refreshToken || data.data?.refreshToken || data.refreshToken || '';

      const user: User = {
        id: userData.id || '1',
        email: userData.email || email,
        role: (userData.role || 'admin') as UserRole,
        firstName: userData.firstName || userData.first_name || userData.name?.split(' ')[0] || 'Admin',
        lastName: userData.lastName || userData.last_name || userData.name?.split(' ').slice(1).join(' ') || '',
        schoolId: userData.schoolId || userData.school_id || null,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      saveTokens(token, refreshToken, user);
      setUser(user);
      if (skeletonTimerRef.current) clearTimeout(skeletonTimerRef.current);
      setShowLoginSkeleton(true);
      skeletonTimerRef.current = setTimeout(() => setShowLoginSkeleton(false), LOGIN_SKELETON_DURATION_MS);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (skeletonTimerRef.current) clearTimeout(skeletonTimerRef.current);
    setShowLoginSkeleton(false);
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      showLoginSkeleton,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
