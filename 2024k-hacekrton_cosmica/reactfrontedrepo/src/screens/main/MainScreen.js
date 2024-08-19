import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity, Modal, Button } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { getLocation } from '../../components/Location';
import { fetchRoute } from '../../components/FetchRoute';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import CustomComponent from "../../components/CustomComponent"; // Assuming CustomComponent is in the same directory

const MainScreen = ({ apiUrl }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { origin, destination } = route.params || {};
  const [region, setRegion] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  const getData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/report`);
      setReports(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getLocation(setLocation, setRegion, setLoading, destination);
    getData();
  }, []);

  const handleItemPress = async (marker) => {
    try {
      setSelectedReport(marker);
      const response = await axios.get(`${apiUrl}/report/modify/${marker.reportId}`);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCloseModal = () => {
    setSelectedReport(null);
  };

  useEffect(() => {
    if (origin && destination) {
      setRegion({
        latitude: destination.latitude,
        longitude: destination.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      fetchRoute(origin, destination, setLoading, setRouteCoordinates);
    }
  }, [destination]);

  const handleResetDestination = () => {
    navigation.navigate('Map', { origin: null, destination: null });
    setRouteCoordinates([]);
  };

  if (loading) {
    return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.searchButton} onPress={() => navigation.navigate('길 찾기')}>
          <Text style={styles.buttonText}>길 찾기</Text>
        </TouchableOpacity>
        {destination && (
            <TouchableOpacity style={styles.resetButton} onPress={handleResetDestination}>
              <Text style={styles.buttonText}>길 찾기 종료</Text>
            </TouchableOpacity>
        )}
        <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
            showsUserLocation={true}
            showsMyLocationButton={true}
            provider={PROVIDER_GOOGLE}
        >
          {(reports || []).map((marker, index) => (
              <Marker
                  key={index}
                  coordinate={{
                    latitude: marker.latitude,
                    longitude: marker.longitude,
                  }}
                  title={marker.title}
                  description={marker.contents}
                  onPress={() => handleItemPress(marker)}
              />
          ))}
          {selectedLocation && (
              <Marker
                  coordinate={{
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                  }}
                  title={selectedLocation.name}
              />
          )}
          {origin && (
              <Marker
                  coordinate={origin}
                  pinColor="red"
                  title="출발지"
              />
          )}
          {destination && (
              <Marker
                  coordinate={destination}
                  pinColor="#3A4CA8"
                  title="도착지"
              />
          )}
          {routeCoordinates.length > 0 && (
              <Polyline
                  coordinates={routeCoordinates}
                  strokeColor="#2363b2"
                  strokeWidth={4}
              />
          )}
        </MapView>
        {selectedReport && (
            <Modal animationType="slide" transparent={true} visible={selectedReport !== null}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>{selectedReport.title}</Text>
                  <Text>{selectedReport.contents}</Text>
                  <Text>Latitude: {selectedReport.latitude}</Text>
                  <Text>Longitude: {selectedReport.longitude}</Text>
                  <Button title="Close" onPress={handleCloseModal} />
                </View>
              </View>
            </Modal>
        )}
        <TouchableOpacity style={styles.reportButton} onPress={() => { getData(); navigation.navigate('Report'); }}>
          <Text style={{ color: '#fff', fontSize: 20 }}>!</Text>
        </TouchableOpacity>

        <CustomComponent />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 70,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 5,
    elevation: 3,
    zIndex: 1,
  },
  resetButton: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    elevation: 3,
    zIndex: 1,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
  reportButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: '#FF0000',
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    height: 60,
  },
});

export default MainScreen;
