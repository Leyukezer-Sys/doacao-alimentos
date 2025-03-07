import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { supabase } from '../api/supabase';
import colors from '../constants/colors';
import Input from '../components/Input'; // Importe o componente Input

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setName(user.user_metadata?.full_name || '');
      setEmail(user.email);
      setAvatarUrl(user.user_metadata?.avatar_url || null);
    }
    setLoading(false);
  };

  const updateName = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name },
    });
    if (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o nome.');
    } else {
      Alert.alert('Sucesso', 'Nome atualizado com sucesso!');
    }
    setLoading(false);
  };

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
      uploadAvatar(file.uri);
    }
  };

  const uploadAvatar = async (uri) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: 'avatar.jpg',
      type: 'image/jpeg',
    });

    const { data, error } = await supabase
      .storage
      .from('avatars')
      .upload(`public/${user.id}.jpg`, formData, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      Alert.alert('Erro', 'Não foi possível fazer upload da foto.');
    } else {
      const url = supabase.storage.from('avatars').getPublicUrl(data.path);
      setAvatarUrl(url.data.publicUrl);
      await supabase.auth.updateUser({ data: { avatar_url: url.data.publicUrl } });
      Alert.alert('Sucesso', 'Foto de perfil atualizada!');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.greenMedium} />
        </View>
      )}

      <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <Icon name="account-circle" size={100} color={colors.greenMedium} />
        )}
        <Text style={styles.changePhotoText}>Alterar foto</Text>
      </TouchableOpacity>

      {/* Usando o componente Input */}
      <Input
        label="Nome"
        placeholder="Digite seu nome"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity onPress={updateName} style={styles.editButton}>
        <Text style={styles.editButtonText}>Salvar</Text>
      </TouchableOpacity>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>E-mail</Text>
        <Text style={styles.emailText}>{email}</Text>
      </View>
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changePhotoText: {
    marginTop: 10,
    color: colors.greenMedium,
    fontSize: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: colors.greenDark,
    marginBottom: 5,
  },
  emailText: {
    fontSize: 16,
    color: colors.greenDark,
  },
  editButton: {
    backgroundColor: colors.greenMedium,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  editButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;