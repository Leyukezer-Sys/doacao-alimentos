import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const HomeScreen = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <Text style={[styles.text, theme === 'dark' && styles.darkText]}>Bem-vindo ao aplicativo!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CFE0BC',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  text: {
    fontSize: 20,
    color: '#1D361F',
  },
  darkText: {
    color: '#FFFFFF',
  },
});

export default HomeScreen;