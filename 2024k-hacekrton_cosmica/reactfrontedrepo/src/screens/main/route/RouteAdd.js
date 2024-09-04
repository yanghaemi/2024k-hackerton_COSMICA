import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text,Alert, TouchableOpacity} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { getLocation } from '../../../components/Location';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import {REACT_APP_LOCAL_API_URL} from "@env";


const RouteAdd = ({apiUrl}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { origin, destination } = route.params || {}; // SearchScreen에서 받은 인자
  const [region, setRegion] = useState(null); // 지도에서 보여주는 현재 화면 (위치 및 지도 표시 영역 정의)
  const [location, setLocation] = useState(null); // 사용자 위치
  const [loading, setLoading] = useState(true); // 로딩 상태 (현재 위치 불러올 때 생기는 텀 방지)
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [reports, setReports] = useState([]); // 모든 신고 내용
  const [selectedLocation, setSelectedLocation] = useState([]); // 터치된 위치 저장


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
  
  
  useEffect(() => { //길 찾기 장소
    if (origin && destination) { //출발지, 목적지 둘 다 정해진 경우
        setRegion({ //도착지를 기준으로 지도 포커스
          latitude: destination.latitude,
          longitude: destination.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        })
        // fetchRoute(origin, destination, setLoading, setRouteCoordinates ); //경로 표시
    }
  }, [destination]);

  const handleResetDestination = () => { //길 찾기 종료 시
    navigation.navigate('Map', { origin: null, destination: null }); // 출발지, 도착지 상태 지우기
    setRouteCoordinates([]); //경로 표시 제거
  };

  const handleResetSelectedLocation = () => { 
    setSelectedLocation([]); // 선택한 경로 초기화
  }

  const handleSetSelectedLocation = async () => { // 선택한 경로 DB저장 요청
    setSelectedLocation(prevLocations => [...prevLocations, {
      "latitude": destination.latitude,
      "longitude": destination.longitude
    }])
    console.log("현재 경로: ", selectedLocation);

try{
    const response = await axios.post(`${apiUrl}/main/addRoute`, {
      selectedLocation,
      origin,
      destination
    });

  console.log(response.data);
  
      Alert.alert('저장 완료', '해당 경로를 저장했습니다!');
      navigation.navigate('Map', { origin: null, destination: null });

    } catch (error) {
      console.error("에러: ", error);
        }
      };

  


 const handleMapPress = (event) => {
  const coordinate = event.nativeEvent.coordinate;
   setSelectedLocation(prevLocations => [...prevLocations, coordinate]);
          console.log(selectedLocation);
   
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
        onPress={() => navigation.navigate('AddScreen')} //클릭 시 검색 화면으로 이동
      >
        <Text style={styles.buttonText}>새 경로 추가</Text>
      </TouchableOpacity>


      {selectedLocation.length > 0 && ( // 도착지 값이 있는 경우 "길찾기 해제" 버튼 렌더링
        <View style={styles.resetButton2_container}>
           <TouchableOpacity style={[styles.resetButton2, { marginRight: 10 }]}
            onPress={handleResetSelectedLocation}
          >
            <Text style={styles.buttonText}>현재 경로 초기화</Text>
            </TouchableOpacity>
            
        
          <TouchableOpacity
            style={styles.resetButton2}
            onPress={handleSetSelectedLocation}
          >
            <Text style={styles.buttonText}>현재 경로 저장</Text>
            </TouchableOpacity>
          </View>
      )}
        
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
        onPress={handleMapPress} // 맵 터치 이벤트 핸들러
       
      >

        <Polyline
          coordinates={selectedLocation}
          strokeColor="#eb34d5" // 경로의 색상
          strokeWidth={4}      // 경로의 두께
        />
        {/* {coordinates.map((coord, index) => (
          <Marker
            key={index}
            coordinate={coord}
            title={`Point ${index + 1}`}
          />
        ))} */}

        {
            (origin && destination) && // selectedLocation이 존재하는지 확인
            selectedLocation.map((marker, index) => ( // 각 마커에 대해 map 함수를 사용
              <Marker
                key={index} // 각 마커에 대한 고유 키
                coordinate={{
                  latitude: marker.latitude, // 마커의 위도
                  longitude: marker.longitude, // 마커의 경도
                }}
                title={String(marker.latitude)} // 마커의 타이틀
                description={`위도: ${marker.latitude}, 경도: ${marker.longitude}`} // 마커의 설명
              />
            ))  
      }

         {reports.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title} // 마커의 타이틀 (예: 장소 이름)
             description={marker.contents} // 마커의 설명 (예: 간단한 설명)
             
          />
        ))}
        
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
        {selectedLocation.length > 0 && ( //경로
          <Polyline
            coordinates={selectedLocation}
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
  resetButton2_container: {
    position: 'absolute',
    bottom: 70,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resetButton2: {
    flex: 1, // 버튼이 동일한 비율로 너비를 차지하도록 설정
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
