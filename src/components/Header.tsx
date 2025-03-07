import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ou outra biblioteca de ícones
import colors from '../constants/colors';
import { useTheme } from '../context/ThemeContext'; // Importe o hook useTheme

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false }) => {
  const navigation = useNavigation();
  const { theme, toggleTheme } = useTheme(); // Use o hook useTheme

  // Ícone do tema (sol para claro, lua para escuro)
  const themeIcon = theme === 'light' ? 'wb-sunny' : 'nightlight-round';

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      {/* Botão de voltar (opcional) */}
      {showBackButton && (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={theme === 'light' ? colors.greenDark : colors.white} />
        </TouchableOpacity>
      )}

      {/* Título do cabeçalho */}
      <Text style={[styles.title, theme === 'dark' && styles.darkTitle]}>{title}</Text>

      {/* Botão de alternância de tema */}
      <TouchableOpacity onPress={toggleTheme} style={styles.rightButton}>
        <Icon name={themeIcon} size={24} color={theme === 'light' ? colors.greenDark : colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.greenBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  darkContainer: {
    backgroundColor: colors.greenDark,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.greenDark,
    flex: 1,
    textAlign: 'center',
    marginLeft: -24, // Ajusta o título se houver botão de voltar
  },
  darkTitle: {
    color: colors.white,
  },
  rightButton: {
    padding: 8,
  },
});

export default Header;