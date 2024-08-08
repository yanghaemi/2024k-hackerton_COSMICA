import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TextInput,
  Button,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import axios from 'axios';
import {getLocation} from '../../components/Location';

const Report = ({apiUrl}) => {
  const [region, setRegion] = useState(null); // 지도에서 보여주는 현재 화면 (위치 및 지도 표시 영역 정의)
  const [location, setLocation] = useState(null); // 사용자 위치
  const [loading, setLoading] = useState(true); // 로딩 상태 (현재 위치 불러올 때 생기는 텀 방지)
  const [title, setTitle] = useState(''); // 신고 제목 상태
  const [contents, setContents] = useState(''); // 신고 내용 상태

  useEffect(() => {
    getLocation(setLocation, setRegion, setLoading); // 위치 받아오는 함수
    console.log("dma", apiUrl);
  }, []);

  if (loading) {
    // 현재 위치 확인해서 표시해 줄 때까지 로딩 화면 보여주는 부분
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/report/create`,
        {
          title: title,
          contents: contents,
        },
      );
      console.log(response.data); // 요청이 성공한 경우 응답 데이터 로그
    } catch (error) {
      console.error('Error posting data:', error); // 에러 발생 시 에러 로그
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion} // 지역 변경 시 상태를 업데이트
        showsUserLocation={true} // 사용자 위치 표시
        showsMyLocationButton={true} // 위치 버튼 표시
      >
        {location && <Marker coordinate={location} title="현재 위치" />}
      </MapView>
      <View style={styles.searchContainer} id="reportForm">
        <TextInput
          style={styles.searchInput}
          placeholder="신고 제목을 입력하세요."
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="신고 내용을 입력하세요."
          value={contents}
          onChangeText={setContents}
        />
        <Button title="저장" onPress={handleSave} />
      </View>
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
  searchContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    elevation: 3,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default Report;
