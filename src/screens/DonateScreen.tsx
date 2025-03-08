import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { supabase } from '../api/supabase';
import colors from '../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DonateScreen = ({ navigation }) => {
  const [doacoes, setDoacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoacoes();
  }, []);

  // Buscar as doações relacionadas ao usuário
  const fetchDoacoes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('doacao')
        .select('*')
        .eq('ususarioid', user.id); // Filtra as doações pelo ID do usuário

      if (error) {
        console.error('Erro ao buscar doações:', error);
      } else {
        setDoacoes(data);
      }
    }
    setLoading(false);
  };

  // Renderizar cada item da lista
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {/* Imagem arredondada */}
      <Image
        source={{ uri: item.image ? `data:image/png;base64,${item.image}` : 'https://via.placeholder.com/100' }}
        style={styles.itemImage}
      />
      {/* Nome e status */}
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>{item.nome}</Text>
        <Text style={styles.itemStatus}>
          Status: {item.ativa ? 'Ativa' : 'Inativa'}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.greenMedium} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Lista de doações */}
      <FlatList
        data={doacoes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />

      {/* Botão flutuante para adicionar nova doação */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AddDonate')}
      >
        <Icon name="add" size={30} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.greenBackground,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.greenBackground,
  },
  listContainer: {
    padding: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.greenDark,
  },
  itemStatus: {
    fontSize: 14,
    color: colors.greenDark,
    marginTop: 5,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: colors.greenMedium,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Sombra no Android
    shadowColor: colors.black, // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});

export default DonateScreen;