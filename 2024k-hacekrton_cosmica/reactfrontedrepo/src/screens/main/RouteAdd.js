import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity, Modal, Button } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { getLocation } from '../../components/Location';
import { fetchRoute } from '../../components/FetchRoute';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';


const RouteAdd = ({apiUrl}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { origin, destination } = route.params || {}; // SearchScreen에서 받은 인자
  const [region, setRegion] = useState(null); // 지도에서 보여주는 현재 화면 (위치 및 지도 표시 영역 정의)
  const [location, setLocation] = useState(null); // 사용자 위치
  const [loading, setLoading] = useState(true); // 로딩 상태 (현재 위치 불러올 때 생기는 텀 방지)
  const [selectedLocation, setSelectedLocation] = useState(null); // 사용자가 선택한 장소
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const [reports, setReports] = useState([]); // 모든 신고 내용
  const [selectedReport, setSelectedReport] = useState(null); // 선택된 리포트


  const getData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/report`);
        // console.log(response.data);
        setReports(response.data);
      } catch (err) {
        console.error(err);
      }
  };

  useEffect(() => {
    getLocation(setLocation, setRegion, setLoading, destination); // 위치 받아오는 함수
    getData();
  }, []);

   const handleItemPress = async (marker) => {
     try {
       setSelectedReport(marker);
      const response = await axios.get(`${apiUrl}/report/modify/${marker.reportId}`);
        console.log(response.data); // 요청이 성공한 경우 응답 데이터 로그
    } catch (error) {
        console.error('Error fetching data:', error); // 에러 발생 시 에러 로그
    }
  };

   const handleCloseModal = () => { // 닫기 버튼 눌렀을 때
    setSelectedReport(null);
  };

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
  }, [destination]);

  const handleResetDestination = () => { //길 찾기 종료 시
    navigation.navigate('AddScreen', { origin: null, destination: null }); // 출발지, 도착지 상태 지우기
    setRouteCoordinates([]); //경로 표시 제거
  };

  const getBus = async ()=>{
    const response = await axios.get(`${apiUrl}/main/bus`)

      console.log(response.data);      
  }

  

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
        <Text style={styles.buttonText}>경로 저장</Text>
      </TouchableOpacity>
      {destination && ( // 도착지 값이 있는 경우 "길찾기 해제" 버튼 렌더링
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetDestination}
        >
          <Text style={styles.buttonText}>경로 저장 취소</Text>
        </TouchableOpacity>
      )}
      <MapView //지도
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion} // 지역 변경 시 상태를 업데이트
        showsUserLocation={true} // 사용자 위치 표시
        showsMyLocationButton={true} // 위치 버튼 표시
      provider={PROVIDER_GOOGLE}
      >
        {/* {location && ( //현재 위치 표시
        {/* {location && ( //현재 위치 표시
          <Marker coordinate={location} title="현재 위치" />
        )} */} 
        {/* 신고 표시랑 헷갈려서 마커만 지웠음 */}

         {reports.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title} // 마커의 타이틀 (예: 장소 이름)
             description={marker.contents} // 마커의 설명 (예: 간단한 설명)
            onPress={()=>handleItemPress(marker)} // 선택한 신고 위치만 클릭됨 (modify 기능 수행)
             
          />
        ))}
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
      {selectedReport && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={selectedReport !== null}
        // onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedReport.title}</Text>
              <Text>{selectedReport.contents}</Text>
              <Text>Latitude: {selectedReport.latitude}</Text>
              <Text>Longitude: {selectedReport.longitude}</Text>
              <Button title="Close" onPress={handleCloseModal} />
            </View>
          </View>
        </Modal>)}
      
      {selectedReport && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={selectedReport !== null}
        // onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedReport.title}</Text>
              <Text>{selectedReport.contents}</Text>
              <Text>Latitude: {selectedReport.latitude}</Text>
              <Text>Longitude: {selectedReport.longitude}</Text>
              <Button title="Close" onPress={handleCloseModal} />
            </View>
          </View>
        </Modal>)}
      
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
  reportButton: {
    position: 'absolute',    // 부모 컨테이너 내에서의 절대 위치 지정
    bottom: 20,              // 하단에서의 거리
    right: 20,               // 우측에서의 거리
    backgroundColor: '#FF0000', // 버튼의 배경색 (예: 빨간색)
    paddingVertical: 10,     // 상하 패딩
    paddingHorizontal: 15,   // 좌우 패딩
    width: 50,               // 버튼의 너비
    height: 50,              // 버튼의 높이 (너비와 동일하게 설정)
    borderRadius: 25,        // 원형으로 만들기 위해 너비/높이의 절반 값
    justifyContent: 'center', // 버튼 내의 내용 정렬 (수직 중앙)
    alignItems: 'center',     // 버튼 내의 내용 정렬 (수평 중앙)
    zIndex: 1000,            // 다른 요소 위에 위치
    elevation: 5,            // Android의 그림자 효과
    shadowColor: '#000',     // iOS의 그림자 효과
    shadowOffset: { width: 1, height: 2 }, // iOS 그림자 오프셋
    shadowOpacity: 0.25,     // iOS 그림자 불투명도
    shadowRadius: 3.84,      // iOS 그림자 반경
  },
  reportButton1: {
    position: 'absolute',    // 부모 컨테이너 내에서의 절대 위치 지정
    bottom: 80,              // 하단에서의 거리
    right: 20,               // 우측에서의 거리
    backgroundColor: '#a389db', // 버튼의 배경색 (예: 빨간색)
    paddingVertical: 10,     // 상하 패딩
    paddingHorizontal: 15,   // 좌우 패딩
    width: 50,               // 버튼의 너비
    height: 50,              // 버튼의 높이 (너비와 동일하게 설정)
    borderRadius: 25,        // 원형으로 만들기 위해 너비/높이의 절반 값
    justifyContent: 'center', // 버튼 내의 내용 정렬 (수직 중앙)
    alignItems: 'center',     // 버튼 내의 내용 정렬 (수평 중앙)
    zIndex: 1000,            // 다른 요소 위에 위치
    elevation: 5,            // Android의 그림자 효과
    shadowColor: '#000',     // iOS의 그림자 효과
    shadowOffset: { width: 1, height: 2 }, // iOS 그림자 오프셋
    shadowOpacity: 0.25,     // iOS 그림자 불투명도
    shadowRadius: 3.84,      // iOS 그림자 반경
    
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
  }
});

export default RouteAdd;
