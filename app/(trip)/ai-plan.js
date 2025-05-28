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
import { generateTripPlan } from '../../utils/aiService';

export default function AiTripPlanScreen() {
  const { destination, travelers, dates, budget } = useLocalSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState('');
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  
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
  
  const handleSavePlan = useCallback(() => {
    Alert.alert(
      'Plan Kaydedildi',
      'Seyahat planınız başarıyla kaydedildi.',
      [
        { 
          text: 'Tamam', 
          onPress: () => router.replace('/(tabs)/trips')
        }
      ]
    );
  }, [tripPlan]);
  
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
                title="Planı Kaydet"
                onPress={handleSavePlan}
                style={styles.saveButton}
              />
              <Button
                title="Yeniden Oluştur"
                onPress={handleGeneratePlan}
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