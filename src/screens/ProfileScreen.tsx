import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  Switch,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import { supabase } from "../api/supabase";
import colors from "../constants/colors";

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDoador, setIsDoador] = useState(false);
  const [isRecebedor, setIsRecebedor] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Buscar o perfil do usuário ao carregar a tela
  const fetchUserProfile = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setName(user.user_metadata?.full_name || "");
      setEmail(user.email);
      setAvatarUrl(user.user_metadata?.avatar_url || null);
      setIsDoador(user.user_metadata?.doador || false);
      setIsRecebedor(user.user_metadata?.recebedor || false);
    }
    setLoading(false);
  };

  // Atualizar o nome do usuário
  const updateName = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name },
    });
    if (error) {
      Alert.alert("Erro", "Não foi possível atualizar o nome.");
    } else {
      Alert.alert("Sucesso", "Nome atualizado com sucesso!");
    }
    setLoading(false);
  };

  // Atualizar o tipo de usuário (doador/recebedor)
  const updateUserType = async (type, value) => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { [type]: value },
    });
    if (error) {
      Alert.alert("Erro", `Não foi possível atualizar o status de ${type}.`);
    } else {
      Alert.alert("Sucesso", `Status de ${type} atualizado com sucesso!`);
      if (type === "doador") setIsDoador(value);
      if (type === "recebedor") setIsRecebedor(value);
    }
    setLoading(false);
  };

  // Selecionar uma imagem da galeria
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de acesso à sua galeria para escolher uma foto."
      );
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
      uploadAvatar(file.uri); // Faz o upload da imagem selecionada
    }
  };

  // Fazer upload da imagem para o Supabase Storage
  const uploadAvatar = async (uri) => {
    setLoading(true);

    try {
      // 1. Converter a URI da imagem para um Blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // 2. Gerar um nome único para o arquivo
      const fileExt = uri.split(".").pop(); // Extrai a extensão do arquivo
      const fileName = `${user.id}.${fileExt}`; // Nome do arquivo baseado no ID do usuário

      // 3. Fazer upload do arquivo para o Supabase Storage
      const { data, error } = await supabase.storage
        .from("avatars") // Nome do bucket
        .upload(fileName, blob, {
          cacheControl: "3600", // Cache de 1 hora
          upsert: true, // Substitui o arquivo se já existir
        });

      if (error) {
        throw error;
      }

      // 4. Obter a URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(data.path);

      // 5. Atualizar o avatar do usuário no banco de dados
      await supabase.auth.updateUser({
        data: { avatar_url: urlData.publicUrl },
      });

      // 6. Atualizar o estado local com a nova URL do avatar
      setAvatarUrl(urlData.publicUrl);

      Alert.alert("Sucesso", "Foto de perfil atualizada!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível fazer upload da foto.");
      console.error("Erro no upload:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.greenMedium} />
        </View>
      )}

      {/* Container da foto de perfil */}
      <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <Icon name="account-circle" size={100} color={colors.greenMedium} />
        )}
        <Text style={styles.changePhotoText}>Alterar foto</Text>
      </TouchableOpacity>

      {/* Campo de nome */}
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />

      {/* Exibir e-mail do usuário */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>E-mail</Text>
        <Text style={styles.emailText}>{email}</Text>
      </View>

      {/* Toggle para Doador/Recebedor */}
      {isDoador && (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Recebedor</Text>
          <Switch
            value={isRecebedor}
            onValueChange={(value) => updateUserType("recebedor", value)}
          />
        </View>
      )}

      {isRecebedor && (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Doador</Text>
          <Switch
            value={isDoador}
            onValueChange={(value) => updateUserType("doador", value)}
          />
        </View>
      )}

      <TouchableOpacity onPress={updateName} style={styles.button}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 1,
  },
  avatarContainer: {
    alignItems: "center",
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
  input: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  emailText: {
    fontSize: 16,
    color: colors.greenDark,
  },
  button: {
    backgroundColor: colors.greenMedium,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
