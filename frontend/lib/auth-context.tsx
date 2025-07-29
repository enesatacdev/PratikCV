'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  avatar?: string;
  isPremium?: boolean;
  premiumCredits?: number;
  phones?: string[];
  emails?: string[];
  address?: string;
  birthDate?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUserAvatar: (avatarUrl: string) => void;
  updateUserProfile: (profileData: {
    fullName: string;
    phones: string[];
    emails: string[];
    address: string;
    profilePhoto?: string;
    birthDate?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  deductPremiumCredit: () => Promise<{ success: boolean; error?: string }>;
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
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Backend API (.NET Core API) - Auth işlemleri için
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const setAuthToken = (token: string) => {
    localStorage.setItem('authToken', token);
    // Cookie olarak da sakla (middleware için)
    document.cookie = `authToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  };

  const removeAuthToken = () => {
    localStorage.removeItem('authToken');
    // Cookie'yi de sil - farklı yollarla dene
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    document.cookie = 'authToken=; path=/; max-age=0; SameSite=Lax';
    // Tüm subdomain'ler için de temizle
    document.cookie = 'authToken=; path=/; domain=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  };

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        const userId = userData.id || userData.userId;
        
        const fullName = userData.name || userData.fullName || userData.email;
        const [firstName = "", lastName = ""] = fullName.split(" ");
        
        setUser({
          id: userId,
          email: userData.email,
          name: fullName,
          firstName,
          lastName,
          role: userData.role,
          avatar: userData.profilePhoto,
          isPremium: userData.isPremium,
          premiumCredits: userData.premiumCredits || 0,
          phones: userData.phones || [],
          emails: userData.emails || [],
          address: userData.address || "",
          birthDate: userData.birthDate || ""
        });
      } else {
        removeAuthToken();
        setUser(null);
      }
    } catch (error) {
      removeAuthToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthToken(data.token || data.accessToken);
        
        const fullName = data.user?.name || data.user?.fullName || data.user?.email;
        const [firstName = "", lastName = ""] = fullName.split(" ");
        
        const loggedInUser = {
          id: data.user?.id || data.userId,
          email: data.user?.email || email,
          name: fullName,
          firstName,
          lastName,
          role: data.user?.role,
          avatar: data.user?.avatar,
          isPremium: data.user?.isPremium,
          premiumCredits: data.user?.premiumCredits || 0
        };
        
        setUser(loggedInUser);

        return { success: true };
      } else {
        return { 
          success: false, 
          error: data.message || data.error || 'Giriş yapılamadı' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Bağlantı hatası. Lütfen daha sonra tekrar deneyin.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          firstName, 
          lastName,
          email, 
          password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthToken(data.token || data.accessToken);
        
        const fullName = data.user?.fullName || `${firstName} ${lastName}`;
        
        const newUser = {
          id: data.user?.id || data.userId,
          email: data.user?.email || email,
          name: fullName,
          firstName,
          lastName,
          role: data.user?.role,
          avatar: data.user?.avatar,
          isPremium: data.user?.isPremium,
          premiumCredits: data.user?.premiumCredits || 0
        };
        
        setUser(newUser);

        return { success: true };
      } else {
        return { 
          success: false, 
          error: data.message || data.error || 'Kayıt olunamadı' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Bağlantı hatası. Lütfen daha sonra tekrar deneyin.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    router.push('/');
  };

  const refreshUser = async () => {
    await checkAuthStatus();
  };

  const updateUserAvatar = (avatarUrl: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        avatar: avatarUrl
      };
      setUser(updatedUser);
    }
  };

  const updateUserProfile = async (profileData: {
    fullName: string;
    phones: string[];
    emails: string[];
    address: string;
    profilePhoto?: string;
    birthDate?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return { success: false, error: 'Yetkilendirme hatası' };
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile-from-cv`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: profileData.fullName,
          phones: profileData.phones,
          emails: profileData.emails,
          address: profileData.address,
          profilePhoto: profileData.profilePhoto,
          birthDate: profileData.birthDate ? new Date(profileData.birthDate).toISOString() : null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const updatedUserData = await response.json();
      
      // User state'ini güncelle
      if (user) {
        const fullName = updatedUserData.fullName || profileData.fullName;
        const [firstName = "", lastName = ""] = fullName.split(" ");
        
        setUser({
          ...user,
          name: fullName,
          firstName,
          lastName,
          email: updatedUserData.email || user.email,
          avatar: updatedUserData.profilePhoto || profileData.profilePhoto || user.avatar,
          phones: updatedUserData.phones || profileData.phones,
          emails: updatedUserData.emails || profileData.emails,
          address: updatedUserData.address || profileData.address,
          birthDate: updatedUserData.birthDate || profileData.birthDate
        });
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Profil güncellenirken hata oluştu'
      };
    }
  };

  const deductPremiumCredit = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user || !user.premiumCredits || user.premiumCredits < 1) {
        return { success: false, error: 'Yeterli kredi yok' };
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        return { success: false, error: 'Yetkilendirme hatası' };
      }

      // Backend endpoint'ini kullan
      const response = await fetch(`${API_BASE_URL}/auth/deduct-premium-credit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Kullanıcı state'ini güncelle
      setUser({
        ...user,
        premiumCredits: data.remainingCredits || (user.premiumCredits - 1)
      });

      return { success: true };
      
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Kredi düşürme hatası' };
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
    updateUserAvatar,
    updateUserProfile,
    deductPremiumCredit,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
