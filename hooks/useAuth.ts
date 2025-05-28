import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, signInWithEmailAndPassword, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import firebaseApp from '../firebaseConfig';

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { auth } = firebaseApp;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      setLoading(false);
      
      // Kullanıcı bilgilerini AsyncStorage'a kaydet veya temizle
      if (authUser) {
        await AsyncStorage.setItem('user', JSON.stringify(authUser));
      } else {
        await AsyncStorage.removeItem('user');
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Signout error:', error);
      return { success: false, error };
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
} 