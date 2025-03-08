import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Callout, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import {supabase} from '../api/supabase';
import colors from '../constants/colors';
import KEY from '../api/ors-key';

const ORS_API_KEY = KEY.Token;

const DonationMapScreen = () => {
  const [doacoes, setDoacoes] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    fetchDoacoes();
    getUserLocation();
  }, []);

  const fetchDoacoes = async () => {
    const { data, error } = await supabase.from('doacao').select('id, nome, latitude, longitude, descricao');
    if (error) {
      console.error('Erro ao buscar doações:', error);
    } else {
      setDoacoes(data);
    }
  };

  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permissão de localização negada');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setUserLocation(location.coords);
    fetchRoutes(location.coords);
  };

  const fetchRoutes = async (userCoords) => {
    if (!userCoords || doacoes.length === 0) return;
    
    const routesData = await Promise.all(
      doacoes.map(async (doacao) => {
        try {
          const response = await axios.get(
            `https://api.openrouteservice.org/v2/directions/driving-car`,
            {
              params: {
                api_key: ORS_API_KEY,
                start: `${userCoords.longitude},${userCoords.latitude}`,
                end: `${doacao.longitude},${doacao.latitude}`,
              },
            }
          );
          return response.data.routes[0].geometry;
        } catch (error) {
          console.error('Erro ao buscar rota:', error);
          return null;
        }
      })
    );
    setRoutes(routesData.filter(route => route));
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation?.latitude || -23.55052,
          longitude: userLocation?.longitude || -46.633308,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {doacoes.map((doacao) => (
          <Marker
            key={doacao.id}
            coordinate={{ latitude: doacao.latitude, longitude: doacao.longitude }}
            title={doacao.nome}
          >
            <Callout>
              <View>
                <Text style={styles.calloutTitle}>{doacao.nome}</Text>
                <Text>{doacao.descricao}</Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {userLocation && (
          <Marker
            coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
            title="Sua localização"
            pinColor="blue"
          />
        )}

        {routes.map((route, index) => (
          <Polyline
            key={`route-${index}`}
            coordinates={route.coordinates.map(([longitude, latitude]) => ({ latitude, longitude }))}
            strokeWidth={3}
            strokeColor="red"
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  calloutTitle: {
    fontWeight: 'bold',
  },
});

export default DonationMapScreen;
