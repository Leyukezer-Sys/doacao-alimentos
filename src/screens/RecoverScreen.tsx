// src/screens/RecoverScreen.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import Button from '../components/Button';
import colors from '../constants/colors';
import { supabase } from '../api/supabase'; // Importe o cliente Supabase
import Toast from 'react-native-toast-message';

const RecoverScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecover = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Por favor, insira seu e-mail.',
      });
      return;
    }

    setLoading(true);

    try {
      // Enviar e-mail de recuperação de senha
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://seusite.com/reset-password', // URL de redirecionamento após redefinição
      });

      if (error) {
        throw error;
      }

      // Se o e-mail for enviado com sucesso
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Um e-mail de recuperação foi enviado. Verifique sua caixa de entrada.',
      });
      navigation.navigate('Login'); // Redirecionar para a tela de login
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: error.message || 'Ocorreu um erro ao enviar o e-mail.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Senha</Text>
      <Text style={styles.subtitle}>
        Insira seu e-mail para receber um link de redefinição de senha.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {loading ? (
        <ActivityIndicator size="large" color={colors.greenMedium} />
      ) : (
        <Button
          title="Enviar"
          onPress={handleRecover}
          disabled={loading}
          style={{ marginTop: 20 }}
        />
      )}

      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Voltar para o login
      </Text>
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
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
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
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default RecoverScreen;