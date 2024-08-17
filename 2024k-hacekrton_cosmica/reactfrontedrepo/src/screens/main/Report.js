import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TextInput,
  Button,
  FlatList,
  Text,
  Pressable,
  TouchableOpacity,
  Modal
} from 'react-native';
import axios from 'axios';
import { getLocation } from '../../components/Location';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';

const Report = ({apiUrl}) => {
  const [region, setRegion] = useState(null); // 지도에서 보여주는 현재 화면 (위치 및 지도 표시 영역 정의)
  const [location, setLocation] = useState(null); // 사용자 위치
  const [latitude, setLatitude] = useState(null); // 사용자 위치
  const [longitude, setLongitude] = useState(null); // 사용자 위치
  const [loading, setLoading] = useState(true); // 로딩 상태 (현재 위치 불러올 때 생기는 텀 방지)
  const [title, setTitle] = useState(''); // 신고 제목 상태
  const [contents, setContents] = useState(''); // 신고 내용 상태
  const [reports, setReports] = useState([]); // 모든 신고 내용
  const [selectedLocation, setSelectedLocation] = useState(null); // 터치된 위치 저장
  const [selectedReport, setSelectedReport] = useState(null); // 선택된 리포트
  const [modifiedTitle, setModifiedTitle] = useState(''); // 신고 제목 상태
  const [modifiedContents, setModifiedContents] = useState(''); // 신고 내용 상태


  const getData =async () => {
      try {
        const response = await axios.get(`${apiUrl}/report`);
        // console.log(response.data);
        setReports(response.data);
      } catch (err) {
        console.error(err);
      }
  };

  const getLocation2 = async () => {
    getLocation(setLocation, setRegion, setLoading);
    setLatitude(location.latitude);
    setLongitude(location.longitude);
    console.log("위치: ", latitude);
    console.log("위치2: ", longitude);

  }



  useEffect(() => {

    getLocation2();

    // 비동기 함수 호출
    getData();
    if (selectedReport) {
      setModifiedTitle(selectedReport.title);
      setModifiedContents(selectedReport.contents);
    }
  }, [selectedReport]);

   useFocusEffect(
    useCallback(() => {
      // 화면이 포커스될 때마다 데이터를 다시 가져오기
      getData();
    }, [])
  );

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
      getLocation2();
      const response = await axios.post(
        `${apiUrl}/report/create`,
        {
          title: title,
          contents: contents,
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude
        },
      );
      console.log(response.data); // 요청이 성공한 경우 응답 데이터 로그
      getData();  // db에 저장했으면 list 새로고침
      setTitle('');
      setContents('');  // 제목, 내용 초기화 ux 추가
    } catch (error) {
      console.error('Error posting data:', error); // 에러 발생 시 에러 로그
    }
  };

  const handleItemPress = async (marker) => {
    try {
      setSelectedReport(marker); // 선택한 신고 저장
      const response = await axios.get(`${apiUrl}/report/modify/${marker.reportId}`);
        console.log(response.data); // 요청이 성공한 경우 응답 데이터 로그
    } catch (error) {
        console.error('Error fetching data:', error); // 에러 발생 시 에러 로그
    }
  };

  const handleDelReport = async() => { // 신고 삭제
    try {
      console.log("눌렸니?");
      const response = await axios.post(`${apiUrl}/report/delete/${selectedReport.reportId}`,
        {
          reportId: selectedReport.reportId
        }
      );
      console.log(response.data);
      handleCloseModal();

    } catch (error) {
      console.error('Error fetching data:', error); // 에러 발생 시 에러 로그
    }
  }

  const handleModifyReport = async() => { // 신고 수정
    try {
      console.log("제목 : ", title, "\n내용: ", contents);
      const response = await axios.post(`${apiUrl}/report/modify/${selectedReport.reportId}`,
        {
          title: modifiedTitle,
          contents: modifiedContents,
        }

      );

      console.log(response.data);

    } catch (error) {
      console.error('Error fetching data:', error); // 에러 발생 시 에러 로그
    }
  }

  const handleCloseModal = () => {
    setSelectedReport(null);
  };

  const handleMapPress = (event) => {
    const coordinate = event.nativeEvent.coordinate;
    setSelectedLocation(coordinate);

  }

  const renderItem = ({ item }) => (
   // 터치하면 수정 가능
    <TouchableOpacity onPress={() => handleItemPress(item.reportId)}>
      <View style={styles.itemContainer}>
        <Text style={styles.title}>제목: {item.title}</Text>
        <Text>내용: {item.contents}</Text>
        <Text>등록 유저 id: {item.registuserId}</Text>
        <Text>report id: {item.registedDate}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>

    <View style={styles.container}>
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

        <MapView //지도
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion} // 지역 변경 시 상태를 업데이트
        showsUserLocation={true} // 사용자 위치 표시
        showsMyLocationButton={true} // 위치 버튼 표시
          provider={PROVIDER_GOOGLE}
          onPress={handleMapPress} // 맵 터치 이벤트 핸들러
      >

        {/* {location && ( //현재 위치 표시
          <Marker coordinate={location} title="현재 위치" />
        )} */}
          {selectedLocation && ( // 선택된 위치에 마커 표시
            <Marker
              coordinate={selectedLocation}
              title="선택된 위치"
              description={`위도: ${selectedLocation.latitude}, 경도: ${selectedLocation.longitude}`}
            />)}

        {reports.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
              reportId: marker.reportId
            }}
            title={marker.title} // 마커의 타이틀 (예: 장소 이름)
            description={marker.contents} // 마커의 설명 (예: 간단한 설명)
            onPress={()=>handleItemPress(marker)} // 선택한 신고 위치만 클릭됨 (modify 기능 수행)
          />
        ))}
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
                <TextInput
          style={styles.modalTitle}
          value={modifiedTitle} // 상태 이름과 일치
          onChangeText={setModifiedTitle} // 상태 업데이트 함수
        >

        </TextInput>
        <TextInput
          value={modifiedContents} // 상태 이름과 일치
          onChangeText={setModifiedContents} // 상태 업데이트 함수
        >

        </TextInput>
              <Text>Latitude: {selectedReport.latitude}</Text>
              <Text>Longitude: {selectedReport.longitude}</Text>
              <View style={styles.btnContainer}>
                <Button title="삭제" onPress={handleDelReport} />
                <Button title="수정" onPress={handleModifyReport} />
                <Button title="Close" onPress={handleCloseModal} />
                </View>
              </View>
          </View>
        </Modal>
      )}
      {/* <View style={styles.reportList} id="reportList">
        <FlatList
          data={reports}
          renderItem={renderItem}
          keyExtractor={(item) => item.reportId.toString()}
        />
      </View> */}
    </View>
    </>
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
        position: 'flex',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        elevation: 3,
    },
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    // reportList: {
    //   position: 'flex',
    //   backgroundColor: 'white',
    //   // marginBottom: 5,
    //   padding:10,
    //   borderRadius: 5,

    // }
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
    btnContainer:{
        flexDirection: 'row'
    },
    reportBnt: {
        margin: 10,
        justifyContent: 'space-between', // 버튼 사이에 공간 균등 배치
        marginTop: 10,
    },
    button: {
        marginHorizontal: 5, // 버튼 간의 간격 설정
    },
});

export default Report;
