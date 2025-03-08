import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { CheckBox } from "react-native-elements";
import { supabase } from "../api/supabase"; // Importe o cliente Supabase
import Toast from "react-native-toast-message";

const RegisterScreen = ({ navigation }) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isDoador, setIsDoador] = useState(false);
  const [isRecebedor, setIsRecebedor] = useState(false);

  const handleRegister = async () => {
    if (!nome || !email || !senha || (!isDoador && !isRecebedor)) {
      Toast.show({
        type: "error",
        text1: "Atenção",
        text2: "Por favor, preencha todos os campos e selecione uma opção.",
      });
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: {
            nome,
            doador: isDoador,
            recebedor: isRecebedor,
          },
        },
      });

      if (error) {
        throw error;
      }

      // Verifique se o e-mail de confirmação foi enviado
      if (data.user && data.user.confirmation_sent_at) {
        Toast.show({
          type: "success",
          text1: "Sucesso",
          text2: "Cadastro realizado com sucesso. Verifique seu e-mail de confirmação.",
        });
        navigation.navigate("Login"); // Redireciona para a tela de login
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível realizar o cadastro. Tente novamente.",
      });
      console.error("Erro no cadastro:", error);
    }
  };

  const handleDoadorChange = () => {
    setIsDoador(!isDoador);
    if (!isDoador && isRecebedor) {
      setIsRecebedor(false);
    }
  };

  const handleRecebedorChange = () => {
    setIsRecebedor(!isRecebedor);
    if (!isRecebedor && isDoador) {
      setIsDoador(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      {/* Campo de Nome */}
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      {/* Campo de E-mail */}
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Campo de Senha */}
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      {/* Checkbox para Doador */}
      <CheckBox
        title="Doador"
        checked={isDoador}
        onPress={handleDoadorChange}
        containerStyle={styles.checkboxContainer}
        textStyle={styles.checkboxText}
      />

      {/* Checkbox para Recebedor */}
      <CheckBox
        title="Recebedor"
        checked={isRecebedor}
        onPress={handleRecebedorChange}
        containerStyle={styles.checkboxContainer}
        textStyle={styles.checkboxText}
      />

      {/* Botão de Cadastro */}
      <TouchableOpacity onPress={handleRegister} style={styles.button}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  checkboxContainer: {
    backgroundColor: "transparent",
    borderWidth: 0,
    marginBottom: 10,
  },
  checkboxText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RegisterScreen;