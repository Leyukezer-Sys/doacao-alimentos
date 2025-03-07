// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Button from '../components/Button';
import colors from '../constants/colors';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Email:', email);
    console.log('Password:', password);
    // Lógica de autenticação aqui
    navigation.navigate('Home');
  };

  const handleRecuper = () =>{

  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Text style={styles.link} onPress={handleRecuper}>Esqueceu a senha?</Text>
      <Button title="Entrar" onPress={handleLogin} style={{ marginTop: 10}} />
      <Button
        title="Registrar-se"
        onPress={() => navigation.navigate('Register')} style={{ marginTop: 10}}      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.greenBackground,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: colors.greenDark,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  link: {
    color: colors.greenDark,
    marginTop: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    alignSelf: 'center',
  }
});

export default LoginScreen;