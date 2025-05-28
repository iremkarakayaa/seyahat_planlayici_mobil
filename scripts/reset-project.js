const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const directoriesToReset = [
  '/app',
  '/components',
  '/hooks',
  '/constants',
  '/scripts',
];

const createExampleApp = () => {
  // app klasörünü oluştur
  if (!fs.existsSync(path.join(process.cwd(), 'app'))) {
    fs.mkdirSync(path.join(process.cwd(), 'app'));
    console.log('📁 New /app directory created.');
  }

  // index.tsx dosyasını oluştur
  fs.writeFileSync(
    path.join(process.cwd(), 'app', 'index.tsx'),
    `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Your App</Text>
      <Text style={styles.subtitle}>Edit app/index.tsx to get started</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});`
  );
  console.log('📄 app/index.tsx created.');

  // _layout.tsx dosyasını oluştur
  fs.writeFileSync(
    path.join(process.cwd(), 'app', '_layout.tsx'),
    `import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#121212' : '#f8f8f8',
        },
        headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
      }}
    />
  );
}`
  );
  console.log('📄 app/_layout.tsx created.');
};

rl.question('Do you want to move existing files to /app-example instead of deleting them? (Y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y' || answer === '') {
    // Dosyaları yedekle
    if (!fs.existsSync(path.join(process.cwd(), 'app-example'))) {
      fs.mkdirSync(path.join(process.cwd(), 'app-example'));
    }

    directoriesToReset.forEach((dir) => {
      const sourcePath = path.join(process.cwd(), dir.substring(1));
      const destPath = path.join(process.cwd(), 'app-example', dir.substring(1));
      
      if (fs.existsSync(sourcePath)) {
        fs.cpSync(sourcePath, destPath, { recursive: true });
        fs.rmSync(sourcePath, { recursive: true, force: true });
        console.log(`🔄 ${dir} moved to /app-example${dir}`);
      }
    });
  } else {
    // Dosyaları sil
    directoriesToReset.forEach((dir) => {
      const dirPath = path.join(process.cwd(), dir.substring(1));
      if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true });
        console.log(`❌ ${dir} deleted.`);
      }
    });
  }

  // Örnek uygulamayı oluştur
  createExampleApp();
  
  rl.close();
}); 