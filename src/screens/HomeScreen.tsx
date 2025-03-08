import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { supabase } from '../api/supabase';
import colors from '../constants/colors';

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [isDoador, setIsDoador] = useState(false);
  const [isRecebedor, setIsRecebedor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Buscar o perfil do usuário ao carregar a tela
  const fetchUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setIsDoador(user.user_metadata?.doador || false);
      setIsRecebedor(user.user_metadata?.recebedor || false);
    }
    setLoading(false);
  };

  // Renderizar a interface com base no tipo de usuário
  const renderUserInterface = () => {
    if (isDoador) {
      return (
        <View style={styles.userContainer}>
          <Text style={styles.welcomeText}>Bem-vindo, Doador!</Text>
          <Text style={styles.descriptionText}>
            Aqui você pode encontrar pessoas que precisam de ajuda e fazer a diferença.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Donate')}
          >
            <Text style={styles.buttonText}>Fazer uma Doação</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (isRecebedor) {
      return (
        <View style={styles.userContainer}>
          <Text style={styles.welcomeText}>Bem-vindo, Recebedor!</Text>
          <Text style={styles.descriptionText}>
            Aqui você pode encontrar doadores dispostos a ajudar.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Receive')}
          >
            <Text style={styles.buttonText}>Abrir Mapa de Doações</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.userContainer}>
          <Text style={styles.welcomeText}>Bem-vindo!</Text>
          <Text style={styles.descriptionText}>
            Por favor, complete seu perfil para começar.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.buttonText}>Completar Perfil</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.greenMedium} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderUserInterface()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.greenBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.greenBackground,
  },
  userContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.greenDark,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.greenDark,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.greenMedium,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: 200,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;