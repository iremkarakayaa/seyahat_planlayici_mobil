import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/Button';

export default function SummaryScreen() {
  const { destination, travelers, startDate, endDate, budget } = useLocalSearchParams();

  // Tarih bilgilerini birleştir
  const dateRange = startDate && endDate 
    ? `${startDate} - ${endDate}`
    : "Tarih seçilmedi";

  const handleContinue = () => {
    // AI seyahat planı ekranına yönlendir
    router.push({
      pathname: '/(trip)/ai-plan',
      params: { 
        destination, 
        travelers, 
        dates: dateRange,
        budget 
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Seyahat Özeti</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Seyahat detaylarınızı onaylayın</Text>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Ionicons name="location" size={24} color="#FF7A00" />
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryLabel}>Destinasyon</Text>
              <Text style={styles.summaryText}>{destination}</Text>
            </View>
          </View>

          <View style={styles.summaryItem}>
            <Ionicons name="people" size={24} color="#FF7A00" />
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryLabel}>Yolcular</Text>
              <Text style={styles.summaryText}>{travelers}</Text>
            </View>
          </View>

          <View style={styles.summaryItem}>
            <Ionicons name="calendar" size={24} color="#FF7A00" />
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryLabel}>Tarihler</Text>
              <Text style={styles.summaryText}>{dateRange}</Text>
            </View>
          </View>

          <View style={styles.summaryItem}>
            <Ionicons name="cash" size={24} color="#FF7A00" />
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryLabel}>Bütçe</Text>
              <Text style={styles.summaryText}>{budget}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Ionicons name="information-circle" size={24} color="#2196F3" style={styles.infoIcon} />
          <Text style={styles.infoText}>
            Bilgilerinizi onayladıktan sonra, yapay zeka seyahat planınızı oluşturacak.
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            title="Değiştir"
            onPress={() => router.back()}
            style={styles.editButton}
            textStyle={styles.editButtonText}
          />
          <Button
            title="AI ile Plan Oluştur"
            onPress={handleContinue}
            style={styles.confirmButton}
          />
        </View>
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  summaryContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryTextContainer: {
    marginLeft: 15,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryText: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: 2,
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 30,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    color: '#0d47a1',
    fontSize: 14,
    lineHeight: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  editButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#FF7A00',
    flex: 1,
    marginRight: 10,
  },
  editButtonText: {
    color: '#FF7A00',
  },
  confirmButton: {
    backgroundColor: '#FF7A00',
    flex: 2,
  },
}); 