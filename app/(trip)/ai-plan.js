import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Button from '../../components/Button';
import { tripApi } from '../../services/apiService';
import { generateTripPlan } from '../../utils/aiService';

export default function AiTripPlanScreen() {
  const { destination, travelers, dates, budget } = useLocalSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [savingTrip, setSavingTrip] = useState(false);
  const [tripPlan, setTripPlan] = useState('');
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  
  // Tarih aralığını işleme
  const parseDates = () => {
    // Varsayılan olarak bugün ve bir hafta sonrası
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    // Varsayılan değerler
    const defaultDates = {
      startDate: today.toISOString(),
      endDate: nextWeek.toISOString()
    };
    
    if (!dates || typeof dates !== 'string') {
      console.log('Geçerli tarih aralığı bulunamadı, varsayılan tarihler kullanılıyor:', defaultDates);
      return defaultDates;
    }
    
    try {
      console.log('İşlenecek tarih verisi:', dates);
      
      // Tarih verisi formatını kontrol et
      if (!dates.includes('-')) {
        throw new Error('Geçersiz tarih formatı: Ayırıcı işaret (-) bulunamadı');
      }
      
      const [startStr, endStr] = dates.split(' - ');
      
      if (!startStr || !endStr) {
        throw new Error('Geçersiz tarih aralığı formatı');
      }
      
      // Tarihleri ayrıştır (GG/AA/YYYY formatı)
      let startDate, endDate;
      
      if (startStr.includes('/')) {
        const [day, month, year] = startStr.split('/').map(num => parseInt(num, 10));
        startDate = new Date(year, month - 1, day); // Ay 0-11 arasında
      } else {
        startDate = new Date(startStr);
      }
      
      if (endStr.includes('/')) {
        const [day, month, year] = endStr.split('/').map(num => parseInt(num, 10));
        endDate = new Date(year, month - 1, day); // Ay 0-11 arasında
      } else {
        endDate = new Date(endStr);
      }
      
      // Tarih geçerliliğini kontrol et
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Tarihler geçerli değil');
      }
      
      // Başlangıç tarihini bitiş tarihinden önce olmalı
      if (startDate > endDate) {
        const temp = startDate;
        startDate = endDate;
        endDate = temp;
      }
      
      console.log('Ayrıştırılan tarih nesneleri:', startDate, endDate);
      
      // ISO String formatına dönüştür ve sadece tarih kısmını al (saat kısmını 00:00:00'a ayarla)
      const startISO = new Date(startDate.setHours(0, 0, 0, 0)).toISOString();
      const endISO = new Date(endDate.setHours(0, 0, 0, 0)).toISOString();
      
      return { startDate: startISO, endDate: endISO };
    } catch (error) {
      console.error('Tarih ayrıştırma hatası:', error.message);
      return defaultDates;
    }
  };
  
  const handleGeneratePlan = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      // Kullanıcı tercihlerini birleştirerek bir prompt oluştur
      const userPrompt = `
        Şu bilgilere göre bana detaylı bir seyahat planı hazırla:
        
        Destinasyon: ${destination || 'Belirtilmemiş'}
        Seyahat Edecek Kişi Tipi: ${travelers || 'Belirtilmemiş'}
        Tarih Aralığı: ${dates || 'Belirtilmemiş'}
        Bütçe: ${budget || 'Belirtilmemiş'}
        
        ${additionalPrompt ? `Ek Notlar: ${additionalPrompt}` : ''}
        
        Lütfen yemek önerileri, görülecek yerler, aktiviteler ve yaklaşık maliyetler hakkında bilgi ver.
      `;
      
      // Seyahat planını oluştur
      const plan = await generateTripPlan(userPrompt);
      setTripPlan(plan);
    } catch (error) {
      console.error('Plan oluşturma hatası:', error);
      Alert.alert(
        'Hata',
        'Seyahat planı oluşturulurken bir sorun oluştu. Lütfen tekrar deneyin.'
      );
    } finally {
      setLoading(false);
    }
  }, [destination, travelers, dates, budget, additionalPrompt]);
  
  const handleSavePlan = useCallback(async () => {
    if (savingTrip || !tripPlan) return;
    
    setSavingTrip(true);
    try {
      const { startDate, endDate } = parseDates();
      console.log('Ayrıştırılan tarihler:', startDate, endDate);
      
      // Bütçe değerini doğru şekilde işle
      let budgetValue = budget;
      // Eğer bütçe string ise ve Ucuz/Orta/Lüks değerlerinden biri ise doğrudan kullan
      if (typeof budget !== 'string' || !budget) {
        budgetValue = 'Belirtilmemiş';
      }
      
      console.log('Kullanılacak bütçe değeri:', budgetValue);
      
      // Seyahat planı verilerini hazırla
      const tripData = {
        title: `${destination} Seyahati`,
        description: tripPlan,
        startDate,
        endDate,
        destinations: [
          {
            name: destination.toString(),
            coordinates: { lat: 0, lng: 0 } // Koordinatlar sonradan güncellenebilir
          }
        ],
        budget: budgetValue,
        notes: additionalPrompt || '',
        activities: []
      };
      
      console.log('Kaydedilecek seyahat verileri:', JSON.stringify({
        title: tripData.title,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        budget: tripData.budget
      }));
      
      // Backend'e seyahat planını kaydet
      const response = await tripApi.createTrip(tripData);
      
      if (response.success) {
        Alert.alert(
          'Başarılı',
          'Seyahat planınız başarıyla kaydedildi.',
          [
            { 
              text: 'Tamam', 
              onPress: () => router.replace('/(tabs)/trips') 
            }
          ]
        );
      } else {
        throw new Error(response.message || 'Kayıt sırasında bir hata oluştu');
      }
    } catch (error) {
      console.error('Plan kaydetme hatası:', error);
      Alert.alert(
        'Hata',
        'Seyahat planınız kaydedilirken bir sorun oluştu. Lütfen tekrar deneyin.'
      );
    } finally {
      setSavingTrip(false);
    }
  }, [tripPlan, destination, travelers, dates, budget, additionalPrompt]);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>AI Seyahat Planı</Text>
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Seyahat Bilgileri</Text>
          <Text style={styles.infoText}><Text style={styles.infoLabel}>Destinasyon:</Text> {destination}</Text>
          <Text style={styles.infoText}><Text style={styles.infoLabel}>Yolcular:</Text> {travelers}</Text>
          <Text style={styles.infoText}><Text style={styles.infoLabel}>Tarihler:</Text> {dates}</Text>
          <Text style={styles.infoText}><Text style={styles.infoLabel}>Bütçe:</Text> {budget}</Text>
        </View>
        
        <View style={styles.promptContainer}>
          <Text style={styles.label}>Ek Detaylar (İsteğe Bağlı)</Text>
          <TextInput
            style={styles.promptInput}
            placeholder="Örn: Çocuk dostu aktiviteler, özel ilgi alanları, özel gereksinimler..."
            value={additionalPrompt}
            onChangeText={setAdditionalPrompt}
            multiline
            numberOfLines={3}
          />
        </View>
        
        <Button
          title="Seyahat Planı Oluştur"
          onPress={handleGeneratePlan}
          disabled={loading}
          style={styles.generateButton}
        />
        
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF7A00" />
            <Text style={styles.loadingText}>Seyahat planınız yapay zeka tarafından hazırlanıyor...</Text>
          </View>
        )}
        
        {tripPlan ? (
          <View style={styles.tripPlanContainer}>
            <Text style={styles.sectionTitle}>Seyahat Planınız</Text>
            <Text style={styles.tripPlanText}>{tripPlan}</Text>
            
            <View style={styles.actionsContainer}>
              <Button
                title={savingTrip ? "Kaydediliyor..." : "Planı Kaydet"}
                onPress={handleSavePlan}
                disabled={savingTrip}
                style={styles.saveButton}
              />
              <Button
                title="Yeniden Oluştur"
                onPress={handleGeneratePlan}
                disabled={loading || savingTrip}
                style={styles.regenerateButton}
              />
            </View>
          </View>
        ) : null}
      </ScrollView>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  infoContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  infoLabel: {
    fontWeight: '600',
  },
  promptContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  promptInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  generateButton: {
    backgroundColor: '#FF7A00',
    marginBottom: 20,
    borderRadius: 10,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  tripPlanContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
  },
  tripPlanText: {
    fontSize: 16,
    lineHeight: 22,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    flex: 1,
    marginRight: 10,
    borderRadius: 10,
  },
  regenerateButton: {
    backgroundColor: '#2196F3',
    flex: 1,
    marginLeft: 10,
    borderRadius: 10,
  },
}); 