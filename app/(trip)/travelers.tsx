import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/Button';

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const travelerTypes = [
  {
    id: 'solo',
    title: 'Sadece Ben',
    description: 'Keşif için yalnız bir gezgin',
    icon: 'person-outline' as IconName,
  },
  {
    id: 'couple',
    title: 'Çift',
    description: 'İki gezgin birlikte keşfe çıkar',
    icon: 'people-outline' as IconName,
  },
  {
    id: 'family',
    title: 'Aile',
    description: 'Eğlenceli bir grup keşif sever',
    icon: 'home-outline' as IconName,
  },
  {
    id: 'friends',
    title: 'Arkadaşlar',
    description: 'Heyecan arayan bir grup',
    icon: 'boat-outline' as IconName,
  },
];

export default function TravelersScreen() {
  const params = useLocalSearchParams();
  const destination = params.destination as string || 'Bilinmeyen Yer';
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedType) {
      router.push({
        pathname: '/(trip)/dates',
        params: { 
          destination, 
          travelerType: selectedType 
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
        <Text style={styles.title}>Kim Seyahat Ediyor</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Seyahat arkadaşlarınızı seçin</Text>

        <View style={styles.typeContainer}>
          {travelerTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeCard,
                selectedType === type.id && styles.selectedCard,
              ]}
              onPress={() => setSelectedType(type.id)}
            >
              <View style={styles.typeIcon}>
                <Ionicons name={type.icon} size={24} color={selectedType === type.id ? '#FF7A00' : '#666'} />
              </View>
              <View style={styles.typeInfo}>
                <Text style={styles.typeTitle}>{type.title}</Text>
                <Text style={styles.typeDescription}>{type.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Devam Et"
          onPress={handleContinue}
          style={styles.continueButton}
          disabled={!selectedType}
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
  typeContainer: {
    marginTop: 10,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  typeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  typeInfo: {
    flex: 1,
  },
  typeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  typeDescription: {
    color: '#666',
    fontSize: 14,
  },
  footer: {
    padding: 20,
  },
  continueButton: {
    backgroundColor: '#FF7A00',
    borderRadius: 40,
  },
});