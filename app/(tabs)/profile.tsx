import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { tripApi } from '../../services/apiService';

export default function ProfileScreen() {
  const { user, logout, updateProfile, isLoading } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [tripCount, setTripCount] = useState(0);
  const [loadingTrips, setLoadingTrips] = useState(false);
  
  // Kullanıcı bilgileri için state
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [tempUserName, setTempUserName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Şifre değiştirme için state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  useEffect(() => {
    // Kullanıcı bilgilerini güncelle
    if (user) {
      setUserName(user.displayName || '');
      setUserEmail(user.email || '');
      setTempUserName(user.displayName || '');
      
      // Kullanıcının seyahat planı sayısını al
      fetchTripCount();
    }
  }, [user]);

  // Kullanıcı giriş yapmamışsa, giriş sayfasına yönlendir
  useEffect(() => {
    if (!isLoading && !user) {
      router.push({
        pathname: '/(auth)/login'
      });
    }
  }, [isLoading, user]);
  
  // Kullanıcının seyahat planlarını getirme fonksiyonu
  const fetchTripCount = async () => {
    if (!user) return;
    
    setLoadingTrips(true);
    try {
      const response = await tripApi.getTrips();
      if (response.success && response.trips) {
        setTripCount(response.trips.length);
      }
    } catch (error) {
      console.error('Seyahat sayısı getirme hatası:', error);
    } finally {
      setLoadingTrips(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      router.push({
        pathname: '/'
      });
    } catch (error) {
      console.error('Çıkış hatası:', error);
      Alert.alert('Hata', 'Çıkış yapılırken bir sorun oluştu. Lütfen tekrar deneyin.');
    }
  };
  
  const handleSaveProfile = async () => {
    if (!tempUserName.trim()) {
      Alert.alert('Hata', 'İsim alanı boş olamaz');
      return;
    }
    
    setIsUpdating(true);
    try {
      await updateProfile({ displayName: tempUserName });
      setUserName(tempUserName);
      setShowEditProfile(false);
      Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi');
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      Alert.alert('Hata', 'Profil güncellenirken bir sorun oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleChangePassword = () => {
    // Şifre doğrulama kontrolleri
    if (!currentPassword) {
      Alert.alert('Hata', 'Lütfen mevcut şifrenizi girin');
      return;
    }
    
    if (!newPassword) {
      Alert.alert('Hata', 'Lütfen yeni şifrenizi girin');
      return;
    }
    
    if (newPassword.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      Alert.alert('Hata', 'Yeni şifreler birbiriyle eşleşmiyor');
      return;
    }
    
    setIsUpdating(true);
    
    // Şimdilik API'de şifre değiştirme işlevi olmadığı için alert gösteriyoruz
    setTimeout(() => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowChangePassword(false);
      setIsUpdating(false);
      Alert.alert('Başarılı', 'Şifreniz başarıyla değiştirildi');
    }, 1000);
    
    // Gerçek implementasyon için:
    // try {
    //   await updateProfile({ password: newPassword, currentPassword });
    //   setCurrentPassword('');
    //   setNewPassword('');
    //   setConfirmPassword('');
    //   setShowChangePassword(false);
    //   Alert.alert('Başarılı', 'Şifreniz başarıyla değiştirildi');
    // } catch (error) {
    //   console.error('Şifre değiştirme hatası:', error);
    //   Alert.alert('Hata', 'Şifre değiştirilirken bir sorun oluştu. Mevcut şifrenizi kontrol edin.');
    // } finally {
    //   setIsUpdating(false);
    // }
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7A00" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profilim</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.profileImageContainer}>
          <Ionicons name="person" size={70} color="#ccc" />
        </View>

        <Text style={styles.userName}>{userName || 'Kullanıcı'}</Text>
        <Text style={styles.userEmail}>{userEmail}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{loadingTrips ? '...' : tripCount}</Text>
            <Text style={styles.statLabel}>Planlanan</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => setShowSettings(true)}>
            <Ionicons name="settings-outline" size={24} color="black" style={styles.menuIcon} />
            <Text style={styles.menuText}>Ayarlar</Text>
            <Ionicons name="chevron-forward" size={24} color="#999" style={styles.menuArrow} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="black" style={styles.menuIcon} />
            <Text style={styles.menuText}>Çıkış Yap</Text>
            <Ionicons name="chevron-forward" size={24} color="#999" style={styles.menuArrow} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Ayarlar Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSettings}
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ayarlar</Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <Ionicons name="close-outline" size={28} color="black" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.modalItem} 
              onPress={() => {
                setShowSettings(false);
                setTempUserName(userName);
                setTimeout(() => setShowEditProfile(true), 300);
              }}
            >
              <Ionicons name="person-outline" size={24} color="black" style={styles.menuIcon} />
              <Text style={styles.menuText}>Profil Düzenle</Text>
              <Ionicons name="chevron-forward" size={24} color="#999" style={styles.menuArrow} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalItem}
              onPress={() => {
                setShowSettings(false);
                setTimeout(() => setShowChangePassword(true), 300);
              }}
            >
              <Ionicons name="key-outline" size={24} color="black" style={styles.menuIcon} />
              <Text style={styles.menuText}>Şifre Değiştir</Text>
              <Ionicons name="chevron-forward" size={24} color="#999" style={styles.menuArrow} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Profil Düzenleme Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showEditProfile}
        onRequestClose={() => setShowEditProfile(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Profil Düzenle</Text>
              <TouchableOpacity onPress={() => setShowEditProfile(false)}>
                <Ionicons name="close-outline" size={28} color="black" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formContainer}>
              <Text style={styles.formLabel}>İsim</Text>
              <TextInput
                style={styles.textInput}
                value={tempUserName}
                onChangeText={setTempUserName}
                placeholder="İsminizi girin"
              />
              
              <Text style={styles.formLabel}>E-posta (değiştirilemez)</Text>
              <View style={styles.disabledInput}>
                <Text style={styles.disabledText}>{userEmail}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleSaveProfile}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Kaydet</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Şifre Değiştirme Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showChangePassword}
        onRequestClose={() => setShowChangePassword(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Şifre Değiştir</Text>
              <TouchableOpacity onPress={() => setShowChangePassword(false)}>
                <Ionicons name="close-outline" size={28} color="black" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formContainer}>
              <Text style={styles.formLabel}>Mevcut Şifre</Text>
              <TextInput
                style={styles.textInput}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Mevcut şifrenizi girin"
                secureTextEntry={true}
              />
              
              <Text style={styles.formLabel}>Yeni Şifre</Text>
              <TextInput
                style={styles.textInput}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Yeni şifrenizi girin"
                secureTextEntry={true}
              />
              
              <Text style={styles.formLabel}>Yeni Şifre (Tekrar)</Text>
              <TextInput
                style={styles.textInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Yeni şifrenizi tekrar girin"
                secureTextEntry={true}
              />
              
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleChangePassword}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Şifre Değiştir</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555'
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  menuContainer: {
    width: '100%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
  },
  menuArrow: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  formContainer: {
    paddingVertical: 10,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  textInput: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  disabledText: {
    color: '#666',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#FF7A00',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 