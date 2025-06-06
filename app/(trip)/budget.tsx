import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/Button';

const budgetOptions = [
  {
    id: 'economy',
    title: 'Ucuz 💵',
    description: 'Maliyetlere dikkat edin',
  },
  {
    id: 'moderate',
    title: 'Orta 💰',
    description: 'Maliyeti ortalama seviyede tutun',
  },
  {
    id: 'luxury',
    title: 'Lüks 💎',
    description: 'Maliyet konusunda endişelenmeyin',
  },
];

export default function BudgetScreen() {
  const params = useLocalSearchParams();
  const destination = params.destination as string || 'Bilinmeyen Yer';
  const travelers = params.travelerType as string || 'solo';
  const startDate = params.startDate as string || '';
  const endDate = params.endDate as string || '';
  
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  
  const handleContinue = () => {
    if (selectedBudget) {
      // Seçilen bütçeyi formatla
      let budgetValue = '';
      
      switch(selectedBudget) {
        case 'economy':
          budgetValue = 'Ucuz';
          break;
        case 'moderate':
          budgetValue = 'Orta';
          break;
        case 'luxury':
          budgetValue = 'Lüks';
          break;
        default:
          budgetValue = selectedBudget;
      }
      
      // AI plan sayfasına yönlendir - seyahat planı oluşturma akışı için
      router.push({
        pathname: '/(trip)/ai-plan',
        params: { 
          destination, 
          travelers, 
          dates: `${startDate ? new Date(startDate).toLocaleDateString('tr-TR') : ''} - ${endDate ? new Date(endDate).toLocaleDateString('tr-TR') : ''}`,
          budget: budgetValue
        }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Bütçe</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Seyahatiniz için harcama alışkanlıklarını seçin</Text>
        
        <View style={styles.optionsContainer}>
          {budgetOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                selectedBudget === option.id && styles.selectedCard,
              ]}
              onPress={() => setSelectedBudget(option.id)}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Devam Et"
          onPress={handleContinue}
          style={styles.createButton}
          disabled={!selectedBudget}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionCard: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
    marginBottom: 15,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#FF7A00',
    backgroundColor: '#FFF5E9',
  },
  optionContent: {
    flexDirection: 'column',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  optionDescription: {
    color: '#666',
    fontSize: 14,
  },
  footer: {
    padding: 20,
  },
  createButton: {
    backgroundColor: '#FF7A00',
    borderRadius: 40,
  },
}); 