import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import { tripApi } from '../../services/apiService';

// Trip tipini tanımla
type Trip = {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  destinations: Array<{
    name: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  }>;
  budget: number | string;
};

export default function TripsScreen() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Seyahat planlarını getir
  const fetchTrips = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setTrips([]);
      return;
    }
    
    try {
      setRefreshing(true);
      console.log('Seyahat planları getiriliyor...');
      const response = await tripApi.getTrips();
      
      if (response.success) {
        console.log(`${response.trips.length} seyahat planı yüklendi`);
        setTrips(response.trips);
      } else {
        console.error('Seyahat planları getirilemedi:', response.message);
        if (!refreshing) {
          Alert.alert(
            'Veri Yükleme Hatası',
            'Seyahat planlarınız yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.'
          );
        }
      }
    } catch (error) {
      console.error('Seyahat planları getirme hatası:', error);
      if (!refreshing) {
        Alert.alert(
          'Bağlantı Hatası',
          'Seyahat planlarınız yüklenirken bir sorun oluştu. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.'
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, refreshing]);

  // Seyahat planını silme fonksiyonu
  const handleDeleteTrip = useCallback(async (id: string) => {
    if (deleting) return;

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
              setDeleting(true);
              const response = await tripApi.deleteTrip(id);
              
              if (response.success) {
                // Başarılı silme durumunda seyahat listesini güncelle
                setTrips(prevTrips => prevTrips.filter(trip => trip._id !== id));
                Alert.alert('Başarılı', 'Seyahat planı başarıyla silindi');
              } else {
                throw new Error(response.message || 'Silme işlemi başarısız oldu');
              }
            } catch (error) {
              console.error('Seyahat silme hatası:', error);
              Alert.alert(
                'Hata',
                'Seyahat planı silinirken bir sorun oluştu. Lütfen tekrar deneyin.'
              );
            } finally {
              setDeleting(false);
            }
          }
        }
      ]
    );
  }, [deleting]);

  // Sayfa yüklendiğinde veya kullanıcı değiştiğinde seyahat planlarını getir
  useEffect(() => {
    fetchTrips();
  }, [fetchTrips, user]);

  // Türkçe tarih formatı: GG/AA/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // İki tarih arasındaki gün sayısını hesapla
  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Son günü de dahil etmek için +1
  };

  // Bütçe metnini formatlama
  const formatBudget = (budget: number | string) => {
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

  // Seyahat kartı bileşeni
  const renderTripCard = ({ item }: { item: Trip }) => {
    const dayCount = calculateDays(item.startDate, item.endDate);
    
    return (
      <View style={styles.tripCardContainer}>
        <Link href={`/(trip)/summary?id=${item._id}`} asChild>
          <TouchableOpacity style={styles.tripCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDates}>
                {formatDate(item.startDate)} - {formatDate(item.endDate)}
              </Text>
            </View>
            
            <View style={styles.cardBody}>
              <Text style={styles.cardDestination}>
                <Ionicons name="location" size={16} color="#FF7A00" />
                {' '}
                {item.destinations.map(d => d.name).join(', ')}
              </Text>
              
              <Text style={styles.cardDescription} numberOfLines={2}>
                {`Gün ${dayCount > 1 ? dayCount : 1}`}
              </Text>
            </View>
            
            <View style={styles.cardFooter}>
              <Text style={styles.cardBudget}>
                <Ionicons name="wallet-outline" size={16} color="#666" />
                {' '}
                {formatBudget(item.budget)}
              </Text>
              <Text style={styles.viewDetails}>Detayları Görüntüle</Text>
            </View>
          </TouchableOpacity>
        </Link>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeleteTrip(item._id)}
          disabled={deleting}
        >
          <Ionicons name="trash-outline" size={22} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Seyahatlerim</Text>
        <Link href="/(trip)/create" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="black" />
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF7A00" />
            <Text style={styles.loadingText}>Seyahat planlarınız yükleniyor...</Text>
          </View>
        ) : trips.length > 0 ? (
          <FlatList
            data={trips}
            keyExtractor={(item) => item._id}
            renderItem={renderTripCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshing={refreshing}
            onRefresh={fetchTrips}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={60} color="#000" style={styles.icon} />
            <Text style={styles.emptyTitle}>Henüz seyahat planın yok</Text>
            <Text style={styles.emptySubtitle}>Seyahat etmenin zamanı geldi. Planlamaya başlayın!</Text>
            
            <Link href="/(trip)/create" asChild>
              <Button 
                title="Yeni bir yolculuğa başla" 
                onPress={() => {}} 
                style={styles.startButton}
              />
            </Link>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
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
  listContent: {
    paddingVertical: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#FF7A00',
    width: '100%',
    borderRadius: 40,
  },
  tripCardContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  tripCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    zIndex: 10,
  },
  cardHeader: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDates: {
    fontSize: 14,
    color: '#666',
  },
  cardBody: {
    marginBottom: 10,
  },
  cardDestination: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cardBudget: {
    fontSize: 14,
    color: '#666',
  },
  viewDetails: {
    fontSize: 14,
    color: '#FF7A00',
    fontWeight: '500',
  },
}); 