import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { tripApi } from '../../services/apiService';

export default function TripSummaryScreen() {
  const { id } = useLocalSearchParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  // Seyahat planını getir
  useEffect(() => {
    const fetchTripDetails = async () => {
      if (!id) {
        Alert.alert('Hata', 'Seyahat ID\'si bulunamadı');
        router.back();
        return;
      }

      try {
        setLoading(true);
        const response = await tripApi.getTripById(id);

        if (response.success) {
          setTrip(response.trip);
        } else {
          Alert.alert('Hata', 'Seyahat planı yüklenemedi');
          router.back();
        }
      } catch (error) {
        console.error('Seyahat detayı getirme hatası:', error);
        Alert.alert(
          'Hata',
          'Seyahat planı yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.'
        );
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [id]);

  // Türkçe tarih formatı: GG/AA/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // İki tarih arasındaki gün sayısını hesapla
  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Son günü de dahil etmek için +1
  };

  // Bütçe metnini formatlama
  const formatBudget = (budget) => {
    // String değer doğrudan göster
    if (typeof budget === 'string') {
      if (!budget || budget === '0' || budget === 'undefined' || budget === 'null') {
        return "Belirtilmemiş";
      }
      return budget;
    }
    
    // Sayısal bütçe değerine göre sınıflandırma
    if (!budget || budget <= 0) return "Belirtilmemiş";
    if (budget < 5000) return "Ucuz";
    if (budget < 15000) return "Orta";
    return "Lüks";
  };

  const handleDeleteTrip = async () => {
    Alert.alert(
      'Seyahat Planını Sil',
      'Bu seyahat planını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await tripApi.deleteTrip(id);
              
              if (response.success) {
                Alert.alert('Başarılı', 'Seyahat planı başarıyla silindi');
                router.replace('/(tabs)/trips');
              } else {
                throw new Error(response.message || 'Silme işlemi başarısız oldu');
              }
            } catch (error) {
              console.error('Seyahat silme hatası:', error);
              Alert.alert(
                'Hata',
                'Seyahat planı silinirken bir sorun oluştu. Lütfen tekrar deneyin.'
              );
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF7A00" />
          <Text style={styles.loadingText}>Seyahat planı yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!trip) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#FF7A00" />
          <Text style={styles.errorText}>Seyahat planı bulunamadı</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Seyahat Detayları</Text>
        <TouchableOpacity onPress={handleDeleteTrip} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{trip.title}</Text>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={18} color="#666" />
            <Text style={styles.dateText}>
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)} ({calculateDays(trip.startDate, trip.endDate)} gün)
            </Text>
          </View>
        </View>

        {trip.destinations && trip.destinations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>Destinasyonlar</Text>
            {trip.destinations.map((destination, index) => (
              <View key={index} style={styles.destinationItem}>
                <Ionicons name="location" size={18} color="#FF7A00" />
                <Text style={styles.destinationText}>{destination.name}</Text>
              </View>
            ))}
          </View>
        )}

        {trip.budget !== undefined && (
          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>Bütçe</Text>
            <View style={styles.budgetContainer}>
              <Ionicons name="wallet-outline" size={18} color="#4CAF50" />
              <Text style={styles.budgetText}>{formatBudget(trip.budget)}</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>Seyahat Planı</Text>
          <Text style={styles.descriptionText}>{trip.description}</Text>
        </View>

        {trip.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>Notlar</Text>
            <Text style={styles.notesText}>{trip.notes}</Text>
          </View>
        )}
      </ScrollView>
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
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  destinationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  destinationText: {
    fontSize: 16,
    marginLeft: 5,
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetText: {
    fontSize: 16,
    marginLeft: 5,
    color: '#4CAF50',
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  notesText: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
    color: '#666',
  },
  backButtonText: {
    fontSize: 16,
    color: '#FF7A00',
    fontWeight: 'bold',
  },
}); 