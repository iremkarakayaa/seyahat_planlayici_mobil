import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Button from '../../components/Button';

interface Destination {
  id: string;
  name: string;
}

export default function CreateTripScreen() {
  const [destination, setDestination] = useState('');
  const [suggestions, setSuggestions] = useState<Destination[]>([
    { id: '1', name: 'İstanbul, Türkiye' },
    { id: '2', name: 'Antalya, Türkiye' },
    { id: '3', name: 'Kapadokya, Türkiye' },
    { id: '4', name: 'Bodrum, Türkiye' },
    { id: '5', name: 'İzmir, Türkiye' },
    { id: '6', name: 'Bursa, Türkiye' },
    { id: '7', name: 'Paris, Fransa' },
    { id: '8', name: 'Roma, İtalya' },
    { id: '9', name: 'Barselona, İspanya' },
    { id: '10', name: 'Londra, İngiltere' },
  ]);

  const [filteredSuggestions, setFilteredSuggestions] = useState<Destination[]>([]);

  // Sayfa odaklandığında (yani sayfaya her girildiğinde) çalışacak efekt
  useFocusEffect(
    useCallback(() => {
      // Sayfaya her girişte metin kutusu ve önerileri sıfırla
      setDestination('');
      setFilteredSuggestions([]);
      
      return () => {
        // Sayfa değiştiğinde temizleme işlemleri (gerekirse)
      };
    }, [])
  );

  const handleSearch = (text: string) => {
    setDestination(text);
    
    if (text.length > 0) {
      const filtered = suggestions.filter(
        item => item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSelectDestination = (item: Destination) => {
    setDestination(item.name);
    setFilteredSuggestions([]);
  };

  const handleContinue = () => {
    if (destination) {
      router.push({
        pathname: '/(trip)/travelers',
        params: { destination }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/trips")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Yer Ara</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Seyahat etmek istediğiniz yeri seçin</Text>

        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Şehir veya ülke ara"
              value={destination}
              onChangeText={handleSearch}
              autoFocus
            />
            {destination.length > 0 && (
              <TouchableOpacity onPress={() => setDestination('')} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {filteredSuggestions.length > 0 && (
          <FlatList
            data={filteredSuggestions}
            keyExtractor={(item) => item.id}
            style={styles.suggestionsList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelectDestination(item)}
              >
                <Ionicons name="location-outline" size={24} color="#FF7A00" style={styles.locationIcon} />
                <Text style={styles.suggestionText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
        
        <View style={styles.buttonContainer}>
          <Button
            title="Devam Et"
            onPress={handleContinue}
            style={styles.continueButton}
            disabled={!destination}
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
    marginBottom: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  suggestionsList: {
    maxHeight: '60%',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  locationIcon: {
    marginRight: 10,
  },
  suggestionText: {
    fontSize: 16,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  continueButton: {
    backgroundColor: '#FF7A00',
    borderRadius: 40,
  },
}); 