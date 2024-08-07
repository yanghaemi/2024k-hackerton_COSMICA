import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { getLocation } from '../../components/Location';
import { fetchRoute } from '../../components/FetchRoute';
import { useNavigation, useRoute } from '@react-navigation/native';

const MainScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { origin, destination } = route.params || {}; // SearchScreen에서 받은 인자
  const [region, setRegion] = useState(null); // 지도에서 보여주는 현재 화면 (위치 및 지도 표시 영역 정의)
  const [location, setLocation] = useState(null); // 사용자 위치
  const [loading, setLoading] = useState(true); // 로딩 상태 (현재 위치 불러올 때 생기는 텀 방지)
  const [selectedLocation, setSelectedLocation] = useState(null); // 사용자가 선택한 장소
  const [routeCoordinates, setRouteCoordinates] = useState([]);


  useEffect(() => {
    getLocation(setLocation, setRegion, setLoading, destination); // 위치 받아오는 함수
  }, [destination]);

  useEffect(() => { //길 찾기 장소
    if (origin && destination) { //출발지, 목적지 둘 다 정해진 경우
        setRegion({ //도착지를 기준으로 지도 포커스
          latitude: destination.latitude,
          longitude: destination.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        })
        fetchRoute(origin, destination, setLoading, setRouteCoordinates ); //경로 표시
    }
  }, [origin, destination]);

  const handleResetDestination = () => { //길 찾기 종료 시
    navigation.navigate('Map', { origin: null, destination: null }); // 출발지, 도착지 상태 지우기
    setRouteCoordinates([]); //경로 표시 제거
  };

  if (loading) { // 현재 위치 확인해서 표시해 줄 때까지 로딩 화면 보여주는 부분
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity //길 찾기 버튼
        style={styles.searchButton}
        onPress={() => navigation.navigate('Search')} //클릭 시 검색 화면으로 이동
      >
        <Text style={styles.buttonText}>길 찾기</Text>
      </TouchableOpacity>
      {destination && ( // 도착지 값이 있는 경우 "길찾기 해제" 버튼 렌더링
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetDestination}
        >
          <Text style={styles.buttonText}>길 찾기 종료</Text>
        </TouchableOpacity>
      )}
      <MapView //지도
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion} // 지역 변경 시 상태를 업데이트
        showsUserLocation={true} // 사용자 위치 표시
        showsMyLocationButton={true} // 위치 버튼 표시
      >
        {location && ( //현재 위치 표시
          <Marker coordinate={location} title="현재 위치" />
        )}
        {selectedLocation && ( // 선택한 장소 표시
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
            title={selectedLocation.name}
          />
        )}
        {origin && ( //출발지
          <Marker
            coordinate={origin}
            pinColor="red" // 색상 변경 가능
            title="출발지"
          />
        )}
        {destination && ( //도착지
          <Marker
            coordinate={destination}
            pinColor="#3A4CA8" // 색상 변경 가능
            title="도착지"
          />
        )}
        {routeCoordinates.length > 0 && ( //경로
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#2363b2" // 경로 선 색상
            strokeWidth={4} // 경로 선 두께
          />
        )}
      </MapView>
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
  searchButton: { //길 찾기 버튼
    position: 'absolute',
    top: 10,
    left: 10, 
    right: 70, 
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 5,
    elevation: 3,
    zIndex: 1, // 버튼이 지도 위에 표시되도록 설정
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
    zIndex: 1, // 버튼이 지도 위에 표시되도록 설정
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default MainScreen;
