import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';

export default function TripLayout() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? colors.background : '#f8f8f8',
        },
        headerTintColor: colorScheme === 'dark' ? colors.text : '#000',
      }}
    >
      <Stack.Screen name="create" options={{ headerTitle: 'Yer Ara' }} />
      <Stack.Screen name="search" options={{ headerTitle: 'Yer Ara' }} />
      <Stack.Screen name="travelers" options={{ headerTitle: 'Kim Seyahat Ediyor' }} />
      <Stack.Screen name="dates" options={{ headerTitle: 'Seyahat Tarihi' }} />
      <Stack.Screen name="budget" options={{ headerTitle: 'Bütçe' }} />
    </Stack>
  );
} 