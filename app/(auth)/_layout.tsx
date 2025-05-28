import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';

export default function AuthLayout() {
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
      <Stack.Screen name="login" options={{ headerTitle: 'Giriş Yap' }} />
      <Stack.Screen name="signup" options={{ headerTitle: 'Hesap Oluştur' }} />
    </Stack>
  );
} 