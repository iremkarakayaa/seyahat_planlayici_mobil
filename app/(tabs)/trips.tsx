import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/Button';

export default function TripsScreen() {
  const hasTrips = false;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Seyahatlerim</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {hasTrips ? (
          <Text>Seyahat listesi burada gösterilecek</Text>
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
}); 