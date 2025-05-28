import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const [showSettings, setShowSettings] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  
  // Kullanıcı bilgileri için state
  const [userName, setUserName] = useState('Kullanıcı Adı');
  const [userEmail] = useState('kullanici@email.com');
  const [tempUserName, setTempUserName] = useState(userName);
  
  // Şifre değiştirme için state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleLogout = () => {
    // Burada çıkış işlemleri yapılabilir (auth state temizleme vb.)
    // Sonra kullanıcıyı açılış sayfasına yönlendir
    router.replace('/');
  };
  
  const handleSaveProfile = () => {
    setUserName(tempUserName);
    setShowEditProfile(false);
    Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi');
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
    
    if (newPassword !== confirmPassword) {
      Alert.alert('Hata', 'Yeni şifreler birbiriyle eşleşmiyor');
      return;
    }
    
    // Şifre değişikliği başarılı olduğunda
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowChangePassword(false);
    Alert.alert('Başarılı', 'Şifreniz başarıyla değiştirildi');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profilim</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.profileImageContainer}>
          <Ionicons name="person" size={70} color="#ccc" />
        </View>

        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userEmail}>{userEmail}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
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
              
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                <Text style={styles.saveButtonText}>Kaydet</Text>
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
              
              <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
                <Text style={styles.saveButtonText}>Şifre Değiştir</Text>
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
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 20,
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
  },
  menuContainer: {
    width: '100%',
    borderRadius: 15,
    backgroundColor: '#f8f8f8',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    flex: 1,
  },
  menuArrow: {
    marginLeft: 'auto',
  },
  // Modal Stilleri
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
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
    borderBottomColor: '#eaeaea',
  },
  // Form Stilleri
  formContainer: {
    paddingBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 15,
  },
  textInput: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    opacity: 0.7,
  },
  disabledText: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#FF7A00',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 25,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 