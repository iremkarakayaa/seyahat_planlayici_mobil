import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { userApi } from '../services/apiService';

// Kullanıcı tipi
interface User {
  _id: string;
  email: string;
  displayName: string;
  token: string;
}

// Auth context state tipi
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

// Context'i oluştur
const AuthContext = React.createContext<AuthContextType | null>(null);

// Provider bileşeni
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Başlangıçta depolanmış kullanıcı bilgilerini kontrol et
  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('user');
        if (jsonValue) {
          setUser(JSON.parse(jsonValue));
        }
      } catch (error) {
        console.error('Kullanıcı bilgisi yükleme hatası:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Giriş işlemi
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await userApi.login(email, password);
      if (response.success && response.user) {
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
      } else {
        throw new Error(response.message || 'Giriş başarısız');
      }
    } catch (error) {
      console.error('Giriş hatası:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Kayıt işlemi
  const register = async (email: string, password: string, displayName?: string) => {
    setIsLoading(true);
    try {
      const response = await userApi.register({ email, password, displayName });
      if (response.success && response.user) {
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
      } else {
        throw new Error(response.message || 'Kayıt başarısız');
      }
    } catch (error) {
      console.error('Kayıt hatası:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Çıkış işlemi
  const logout = async () => {
    setIsLoading(true);
    try {
      await userApi.logout();
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Çıkış hatası:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Profil güncelleme
  const updateProfile = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      const response = await userApi.updateProfile(userData);
      if (response.success && response.user) {
        const updatedUser = { ...(user as User), ...response.user };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        throw new Error(response.message || 'Profil güncelleme başarısız');
      }
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Value objesi
  const contextValue: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Auth hook
function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// İki bileşeni de dışa aktar
export { AuthProvider, useAuth };
