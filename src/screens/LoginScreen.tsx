// src/screens/LoginScreen.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Image, ActivityIndicator } from "react-native";
import Button from "../components/Button";
import colors from "../constants/colors";
import Toast from "react-native-toast-message";
import { supabase } from "../api/supabase"; // Importe o cliente Supabase

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Campos Incompletos',
        text2: 'Por favor, preencha todos os campos.'
      });
      return;
    }
  
    setLoading(true);
  
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        // Tratamento específico para credenciais inválidas
        if (error.message === 'Credenciais inválidas') {
          throw new Error('E-mail ou senha incorretos. Por favor, tente novamente.');
        } else {
          throw error;
        }
      }
  
      Toast.show({
        type: 'success',
        text1: 'Sucesso!',
        text2: 'Bem-vindo!'
      });
      navigation.navigate('Home');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Falha na autenticação',
        text2: error.message || 'Erro ao fazer login. Verifique suas credenciais.'
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecuper = () => {
    navigation.navigate("Recover"); // Navegue para a tela de recuperação de senha
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/favicon.png")} // Caminho da imagem
        style={styles.logo}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Text style={styles.link} onPress={handleRecuper}>
        Esqueceu a senha?
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color={colors.greenMedium} />
      ) : (
        <>
          <Button
            title="Entrar"
            onPress={handleLogin}
            disabled={loading} // Desabilita o botão durante o carregamento
            style={{ marginTop: 10 }}
          />
          <Button
            title="Registrar-se"
            onPress={() => navigation.navigate("Register")}
            disabled={loading} // Desabilita o botão durante o carregamento (opcional)
            style={{ marginTop: 10 }}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.greenBackground,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    color: colors.greenDark,
    marginBottom: 20,
    textAlign: "center",
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
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    alignSelf: "center",
  },
  logo: {
    width: 100, // Tamanho da imagem
    height: 100, // Tamanho da imagem
    borderRadius: 50, // Metade da largura/altura para tornar a imagem redonda
    marginBottom: 20, // Espaçamento abaixo da imagem
    alignSelf: "center",
  },
});

export default LoginScreen;