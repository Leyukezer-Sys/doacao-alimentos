import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import colors from '../constants/colors';

const RegisterScreen = ({}) => {
  const navigation = useNavigation();

  // Estados para os campos do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Função para validar os campos
  const validateFields = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return false;
    }
    return true;
  };

  // Função para lidar com o registro
  const handleRegister = () => {
    if (validateFields()) {
      // Aqui você pode integrar a lógica de registro (ex: Firebase Auth)
      console.log('Nome:', name);
      console.log('Email:', email);
      console.log('Senha:', password);

      // Exibir mensagem de sucesso
      Alert.alert('Sucesso', 'Registro realizado com sucesso!');
    }
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <Header title="Registro" showBackButton />

      {/* Formulário de Registro */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          keyboardType="email-address"
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
        <TextInput
          style={styles.input}
          placeholder="Confirme a Senha"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Botão de Registro */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>

        {/* Link para a tela de Login */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>
            Já tem uma conta? <Text style={styles.loginLink}>Faça login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.greenBackground,
  },
  form: {
    padding: 20,
  },
  input: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.greenMedium,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    marginTop: 20,
    textAlign: 'center',
    color: colors.greenDark,
  },
  loginLink: {
    fontWeight: 'bold',
    color: colors.greenMedium,
  },
});

export default RegisterScreen;