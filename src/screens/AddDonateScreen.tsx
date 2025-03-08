import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../api/supabase';
import colors from '../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker } from 'react-native-maps';

const AddDonateScreen = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('');
  const [image, setImage] = useState(null);
  const [dataAbertura, setDataAbertura] = useState('');
  const [dataFinalizad, setDataFinalizad] = useState('');
  const [ativa, setAtiva] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [endereco, setEndereco] = useState('');

  // Coordenadas iniciais para Ji-Paraná, RO
  const initialRegion = {
    latitude: -10.8811,
    longitude: -61.9518,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // Selecionar uma imagem da galeria
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para escolher uma foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const file = result.assets[0];
      setImage(file.uri);
    }
  };

  // Converter a imagem para base64
  const convertImageToBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result.split(',')[1]); // Extrai a parte base64 da string
        } else {
          reject(new Error('Falha ao converter imagem para base64.'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Adicionar nova doação
  const addDonation = async () => {
    if (!nome || !descricao || !tipo || !dataAbertura || !dataFinalizad || !selectedLocation) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado.');
      }

      let imageBase64 = null;
      if (image) {
        imageBase64 = await convertImageToBase64(image);
      }

      // Inserir doação na tabela doacoes
      const { data, error } = await supabase
        .from('doacoes')
        .insert([
          {
            nome,
            descricao,
            tipo,
            image: imageBase64,
            dataAbertura,
            dataFinalizad,
            ativa,
            ususariold: user.id,
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            endereco,
            create_at: new Date().toISOString(),
          },
        ]);

      if (error) {
        throw error;
      }

      Alert.alert('Sucesso', 'Doação adicionada com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar a doação.');
      console.error('Erro ao adicionar doação:', error);
    } finally {
      setLoading(false);
    }
  };

  // Selecionar localização no mapa
  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    // Aqui você pode adicionar uma chamada para uma API de geocodificação reversa para obter o endereço
    setEndereco(`Lat: ${latitude}, Long: ${longitude}`);
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.greenMedium} />
        </View>
      )}

      {showMap ? (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
            onPress={handleMapPress}
          >
            {selectedLocation && (
              <Marker coordinate={selectedLocation} />
            )}
          </MapView>
          <TouchableOpacity onPress={() => setShowMap(false)} style={styles.mapCloseButton}>
            <Text style={styles.mapCloseButtonText}>Fechar Mapa</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Campo de nome */}
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
          />

          {/* Campo de descrição */}
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            value={descricao}
            onChangeText={setDescricao}
            multiline
          />

          {/* Campo de tipo */}
          <TextInput
            style={styles.input}
            placeholder="Tipo"
            value={tipo}
            onChangeText={setTipo}
          />

          {/* Campo de data de abertura */}
          <TextInput
            style={styles.input}
            placeholder="Data de Abertura (YYYY-MM-DD)"
            value={dataAbertura}
            onChangeText={setDataAbertura}
          />

          {/* Campo de data de finalização */}
          <TextInput
            style={styles.input}
            placeholder="Data de Finalização (YYYY-MM-DD)"
            value={dataFinalizad}
            onChangeText={setDataFinalizad}
          />

          {/* Campo de status */}
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Ativa:</Text>
            <TouchableOpacity
              style={[styles.switchButton, ativa ? styles.switchButtonActive : styles.switchButtonInactive]}
              onPress={() => setAtiva(!ativa)}
            >
              <Text style={styles.switchText}>{ativa ? 'Sim' : 'Não'}</Text>
            </TouchableOpacity>
          </View>

          {/* Selecionar imagem */}
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            {image ? (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            ) : (
              <Text style={styles.imagePickerText}>Selecionar Imagem</Text>
            )}
          </TouchableOpacity>

          {/* Selecionar endereço de coleta */}
          <TouchableOpacity onPress={() => setShowMap(true)} style={styles.addressPicker}>
            <Text style={styles.addressPickerText}>
              {selectedLocation ? `Endereço: ${endereco}` : 'Selecionar Endereço de Coleta'}
            </Text>
          </TouchableOpacity>

          {/* Botão para adicionar doação */}
          <TouchableOpacity onPress={addDonation} style={styles.button}>
            <Text style={styles.buttonText}>Adicionar Doação</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.greenBackground,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1,
  },
  input: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    color: colors.greenDark,
    marginRight: 10,
  },
  switchButton: {
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchButtonActive: {
    backgroundColor: colors.greenMedium,
  },
  switchButtonInactive: {
    backgroundColor: colors.gray,
  },
  switchText: {
    color: colors.white,
    fontSize: 16,
  },
  imagePicker: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  imagePickerText: {
    color: colors.greenDark,
    fontSize: 16,
  },
  addressPicker: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  addressPickerText: {
    color: colors.greenDark,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.greenMedium,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapCloseButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: colors.greenMedium,
    padding: 10,
    borderRadius: 10,
  },
  mapCloseButtonText: {
    color: colors.white,
    fontSize: 16,
  },
});

export default AddDonateScreen;