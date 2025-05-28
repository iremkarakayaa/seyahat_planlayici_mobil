import { Ionicons } from '@expo/vector-icons';
import { Stack, Tabs } from "expo-router";
import { useColorScheme } from 'react-native';
import Colors from '../constants/Colors';
import { TripsProvider } from '../context/TripsContext';

export default function RootLayout() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  
  return (
    <TripsProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? colors.background : '#f8f8f8',
          },
          headerTintColor: colorScheme === 'dark' ? colors.text : '#000',
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(trip)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </TripsProvider>
  );
}

export function TabLayout() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="(auth)"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Seyahatlarım',
          tabBarIcon: ({ color }) => <Ionicons name="map-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Keşfet',
          tabBarIcon: ({ color }) => <Ionicons name="compass-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(trip)"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
