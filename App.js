import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import DonateScreen from "./src/screens/DonateScreen";
import ReceiveScreen from "./src/screens/ReceiveScreen";
import { ThemeProvider } from "./src/context/ThemeContext";
import Toast from "react-native-toast-message";
import AddDonateScreen from "./src/screens/AddDonateScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          {/* Tela de Login */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Login" }} // Título da tela
          />
          {/* Tela de Registro */}
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: "Registro" }}
          />
          {/* Tela Principal */}
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Início", headerLeft: null }} // Remove o botão de voltar
          />
          {/* Tela de Perfil */}
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: "Perfil" }}
          />
          {/* Tela de Doacao */}
          <Stack.Screen
            name="Donate"
            component={DonateScreen}
            options={{ title: "Doações" }}
          />
          {/* Tela de Adicionar Doacao */}
          <Stack.Screen
            name="AddDonate"
            component={AddDonateScreen}
            options={{ title: "Doações" }}
          />
          {/* Tela de ver Doacoes */}
          <Stack.Screen
            name="Receive"
            component={ReceiveScreen}
            options={{ title: "Doações" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </ThemeProvider>
  );
};

export default App;
