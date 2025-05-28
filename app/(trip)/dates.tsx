import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import Button from '../../components/Button';

interface MarkedDates {
  [date: string]: {
    selected?: boolean;
    marked?: boolean;
    startingDay?: boolean;
    endingDay?: boolean;
    color?: string;
  };
}

export default function DatesScreen() {
  const params = useLocalSearchParams();
  const destination = params.destination as string || 'Bilinmeyen Yer';
  const travelerType = params.travelerType as string || 'solo';
  
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  
  const handleDayPress = (day: DateData) => {
    const dateString = day.dateString;
    
    if (!startDate || (startDate && endDate)) {
      // İlk seçim veya yeni bir seçim başlatılıyor
      setStartDate(dateString);
      setEndDate('');
      setMarkedDates({
        [dateString]: { selected: true, color: '#FF7A00', startingDay: true, endingDay: true }
      });
    } else {
      // İkinci seçim
      if (dateString < startDate) {
        // Eğer kullanıcı daha erken bir tarih seçtiyse, tarihleri değiştir
        setEndDate(startDate);
        setStartDate(dateString);
      } else {
        setEndDate(dateString);
      }
      
      // İki tarih arasındaki tüm günleri işaretle
      const newMarkedDates: MarkedDates = {};
      let currentDate = new Date(startDate);
      const lastDate = new Date(dateString < startDate ? startDate : dateString);
      const firstDate = new Date(dateString < startDate ? dateString : startDate);
      
      while (currentDate <= lastDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        
        if (dateStr === firstDate.toISOString().split('T')[0]) {
          newMarkedDates[dateStr] = { selected: true, color: '#FF7A00', startingDay: true };
        } else if (dateStr === lastDate.toISOString().split('T')[0]) {
          newMarkedDates[dateStr] = { selected: true, color: '#FF7A00', endingDay: true };
        } else {
          newMarkedDates[dateStr] = { selected: true, color: '#FF7A00' };
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      setMarkedDates(newMarkedDates);
    }
  };
  
  const formatDateRange = () => {
    if (!startDate) return '';
    if (!endDate) return new Date(startDate).toLocaleDateString('tr-TR');
    
    return `${new Date(startDate).toLocaleDateString('tr-TR')} - ${new Date(endDate).toLocaleDateString('tr-TR')}`;
  };
  
  const handleContinue = () => {
    router.push({
      pathname: '/(trip)/budget',
      params: { 
        destination, 
        travelerType,
        startDate,
        endDate: endDate || startDate // Eğer bitiş tarihi yoksa başlangıç tarihini gönder
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Seyahat Tarihi</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Seyahatiniz için tarih aralığı seçin</Text>
        
        <View style={styles.dateInfo}>
          <Ionicons name="calendar-outline" size={24} color="#FF7A00" />
          <Text style={styles.dateText}>
            {startDate 
              ? formatDateRange()
              : 'Lütfen başlangıç ve bitiş tarihlerini seçin'}
          </Text>
        </View>
        
        <Calendar
          onDayPress={handleDayPress}
          markedDates={markedDates}
          markingType="period"
          theme={{
            selectedDayBackgroundColor: '#FF7A00',
            todayTextColor: '#FF7A00',
            arrowColor: '#FF7A00',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14,
          }}
          minDate={new Date().toISOString().split('T')[0]}
        />
        
        {startDate && (
          <View style={styles.instructionContainer}>
            <Text style={styles.instruction}>
              {endDate 
                ? 'Yeni bir aralık seçmek için herhangi bir tarih seçin'
                : 'Şimdi bitiş tarihini seçin'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Button
          title="Devam Et"
          onPress={handleContinue}
          style={styles.continueButton}
          disabled={!startDate}
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
    marginBottom: 20,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  instructionContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FFF5E9',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF7A00',
  },
  instruction: {
    fontSize: 16,
    color: '#333',
  },
  footer: {
    padding: 20,
  },
  continueButton: {
    backgroundColor: '#FF7A00',
    borderRadius: 40,
  },
}); 