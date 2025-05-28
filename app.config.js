import 'dotenv/config';

export default {
  expo: {
    name: 'syhtplnlyc',
    slug: 'syhtplnlyc',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'syhtplnlyc',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      edgeToEdgeEnabled: true
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png'
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          'image': './assets/images/splash-icon.png',
          'imageWidth': 200,
          'resizeMode': 'contain',
          'backgroundColor': '#ffffff'
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      // API anahtarını çevre değişkenlerinden veya varsayılan değer olarak ayarlama
      geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || '',
      eas: {
        projectId: 'your-project-id'
      }
    }
  }
}; 