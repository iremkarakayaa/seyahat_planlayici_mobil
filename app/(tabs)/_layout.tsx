import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';

export default function TabLayout() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Seyahatlerim',
          headerTitle: 'Seyahatlerim',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="map-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          headerTitle: 'Profilim',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
} 