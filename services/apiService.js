import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

// API temel URL'si - Cihaz ve emülatör tipine göre doğru endpoint seçilir
let API_URL;

// Platform tespiti
if (__DEV__) {
  // Geliştirici bilgisayarının yerel ağdaki IP adresi
  const DEV_MACHINE_IP = '172.20.10.5'; // Geliştirme bilgisayarının IP adresi
  
  // Emülatör/Simülatör için:
  if (Platform.OS === 'android') {
    // Android emülatör için 10.0.2.2, gerçek cihaz için geliştirici bilgisayarının IP'si
    API_URL = `http://${DEV_MACHINE_IP}:5000/api`; 
  } else if (Platform.OS === 'ios') {
    // iOS için de geliştirici bilgisayarının IP'si
    API_URL = `http://${DEV_MACHINE_IP}:5000/api`;
  } else {
    // Web için geliştirici bilgisayarının IP'si
    API_URL = `http://${DEV_MACHINE_IP}:5000/api`;
  }
} else {
  // Production için gerçek API endpoint
  API_URL = 'https://your-production-api.com/api';
}

console.log('API endpoint:', API_URL);

// API istekleri için axios örneği
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000, // Timeout süresini arttırdık
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token yönetimi
const getToken = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('user');
    if (jsonValue) {
      const user = JSON.parse(jsonValue);
      return user.token;
    }
    return null;
  } catch (error) {
    console.error('Token getirme hatası:', error);
    return null;
  }
};

// Her istekte token'ı ekle
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Token API isteğine eklendi');
      } else {
        console.log('Token bulunamadı');
      }
    } catch (error) {
      console.error('Token eklenirken hata:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Hata yönetimi için interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.log('Bağlantı zaman aşımı:', error.message);
    } else if (!error.response) {
      console.log('Network Error: Sunucuya bağlanılamıyor. Backend çalışıyor mu?');
    } else if (error.response.status === 401) {
      console.log('Kimlik doğrulama hatası: Kullanıcı oturumu geçersiz');
      // Kullanıcı oturumunu temizle
      AsyncStorage.removeItem('user')
        .then(() => console.log('Geçersiz oturum temizlendi'))
        .catch(err => console.error('Oturum temizleme hatası:', err));
    } else {
      console.log('API Error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

// Kullanıcı API servisleri
const userApi = {
  // Kullanıcı kaydı
  register: async (userData) => {
    try {
      console.log('Kayıt isteği gönderiliyor:', userData.email);
      const response = await apiClient.post('/users/register', userData);
      console.log('Kayıt yanıtı:', response.data);
      return response.data;
    } catch (error) {
      console.error('Kayıt hatası:', error);
      if (error.response) {
        console.error('Sunucu yanıtı:', error.response.data);
        throw error.response.data;
      } else {
        console.error('Network hatası:', error.message);
        throw { 
          success: false,
          message: 'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin veya daha sonra tekrar deneyin.'
        };
      }
    }
  },

  // Kullanıcı girişi
  login: async (email, password) => {
    try {
      console.log('Giriş isteği gönderiliyor:', email);
      const response = await apiClient.post('/users/login', { email, password });
      console.log('Giriş yanıtı:', response.data);
      
      // Başarılı giriş durumunda kullanıcı bilgilerini AsyncStorage'a kaydet
      if (response.data.success && response.data.user) {
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Giriş hatası:', error);
      if (error.response) {
        console.error('Sunucu yanıtı:', error.response.data);
        throw error.response.data;
      } else {
        console.error('Network hatası:', error.message);
        throw { 
          success: false,
          message: 'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin veya daha sonra tekrar deneyin.'
        };
      }
    }
  },

  // Kullanıcı çıkışı
  logout: async () => {
    try {
      await AsyncStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      console.error('Çıkış hatası:', error.message);
      throw error;
    }
  },

  // Kullanıcı profili getir
  getProfile: async () => {
    try {
      const response = await apiClient.get('/users/profile');
      return response.data;
    } catch (error) {
      console.error('Profil getirme hatası:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },

  // Kullanıcı bilgilerini güncelleme
  updateProfile: async (userData) => {
    try {
      const response = await apiClient.put('/users/profile', userData);
      
      // Başarılı güncelleme durumunda kullanıcı bilgilerini AsyncStorage'da güncelle
      if (response.data.success && response.data.user) {
        const storedUser = JSON.parse(await AsyncStorage.getItem('user'));
        const updatedUser = { ...storedUser, ...response.data.user };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      console.error('Profil güncelleme hatası:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  }
};

// Seyahat planları API servisleri
const tripApi = {
  // Kullanıcının seyahat planlarını getir
  getTrips: async () => {
    try {
      const response = await apiClient.get('/trips');
      return response.data;
    } catch (error) {
      console.error('Seyahat planlarını getirme hatası:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },

  // Yeni seyahat planı oluştur
  createTrip: async (tripData) => {
    try {
      const response = await apiClient.post('/trips', tripData);
      return response.data;
    } catch (error) {
      console.error('Seyahat planı oluşturma hatası:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },

  // Seyahat planını güncelle
  updateTrip: async (tripId, tripData) => {
    try {
      const response = await apiClient.put(`/trips/${tripId}`, tripData);
      return response.data;
    } catch (error) {
      console.error('Seyahat planı güncelleme hatası:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },

  // Seyahat planını sil
  deleteTrip: async (tripId) => {
    try {
      const response = await apiClient.delete(`/trips/${tripId}`);
      return response.data;
    } catch (error) {
      console.error('Seyahat planı silme hatası:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },

  // Seyahat planı detaylarını getir
  getTripById: async (tripId) => {
    try {
      const response = await apiClient.get(`/trips/${tripId}`);
      return response.data;
    } catch (error) {
      console.error('Seyahat planı getirme hatası:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  }
};

export { tripApi, userApi };
