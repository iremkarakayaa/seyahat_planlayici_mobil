import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export default function Button({ title, onPress, style, textStyle, disabled = false }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, textStyle, disabled && styles.disabledText]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabled: {
    backgroundColor: '#cccccc',
  },
  disabledText: {
    color: '#999999',
  },
}); 