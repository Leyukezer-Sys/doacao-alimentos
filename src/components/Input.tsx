import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View, Text } from 'react-native';
import colors from '../constants/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <View style={styles.container}>
      {/* Label (opcional) */}
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Campo de Texto */}
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor={colors.greenMedium}
        {...props}
      />

      {/* Mensagem de Erro (opcional) */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: colors.greenDark,
    marginBottom: 5,
  },
  input: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    color: colors.greenDark,
    borderWidth: 1,
    borderColor: colors.greenMedium,
  },
  inputError: {
    borderColor: 'red', // Cor da borda quando há erro
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
});

export default Input;