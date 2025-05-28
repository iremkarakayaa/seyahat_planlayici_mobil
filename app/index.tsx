import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';

export default function WelcomeScreen() {
  return (
    <ImageBackground 
      source={require('../assets/images/login5.jpg')} 
      style={styles.background}
      imageStyle={{ opacity: 0.6 }}
    >
      <View style={styles.overlay}>
        <StatusBar style="light" />
        <View style={styles.content}>
          <Text style={styles.title}>AI Seyahat Planlayıcı</Text>
          
          <View style={styles.imageContainer}>
            <Image 
              source={require('../assets/images/login5.jpg')} 
              style={styles.image} 
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.subtitle}>En iyi seyahatlerinizi planlayın</Text>
          
          <Link href="/(auth)/signup" asChild>
            <Button 
              title="Hesap Oluştur" 
              onPress={() => {}} 
              style={styles.button}
            />
          </Link>
          
          <Link href="/(tabs)/trips" asChild>
            <Button 
              title="Seyahatlerim" 
              onPress={() => {}} 
              style={styles.tripsButton}
            />
          </Link>
          
          <Link href="/(auth)/login" style={styles.loginLink}>
            <Text style={styles.loginText}>Hesabınız var mı? <Text style={styles.loginBold}>Giriş yapın</Text></Text>
          </Link>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Koyu overlay
  },
  container: {
    flex: 1,
    backgroundColor: '#67847e',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  imageContainer: {
    width: 200,
    height: 200,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'none', // Logoyu gizledim çünkü arka planda resim var
  },
  image: {
    width: '100%',
    height: '100%',
  },
  subtitle: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginBottom: 60,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  button: {
    backgroundColor: '#FF7A00',
    width: '100%',
    padding: 15,
    borderRadius: 40,
    marginBottom: 20,
  },
  tripsButton: {
    backgroundColor: '#4CAF50', // Yeşil renk
    width: '100%',
    padding: 15,
    borderRadius: 40,
    marginBottom: 20,
  },
  loginLink: {
    marginTop: 10,
  },
  loginText: {
    fontSize: 16,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5
  },
  loginBold: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
