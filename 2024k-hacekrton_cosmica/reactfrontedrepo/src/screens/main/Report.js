import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TextInput,
  Button,
  FlatList,
  Text,
  Pressable,
  TouchableOpacity
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
  const [reports, setReports] = useState([]); // 모든 신고 내용


  const getData =async () => {
      try {
        const response = await axios.get(`${apiUrl}/report`)
        console.log(response.data);
        setReports(response.data);
      } catch (err) {
        console.error(err);
      }
  };
  
  useEffect(() => {
    getLocation(setLocation, setRegion, setLoading); // 위치 받아오는 함수
    

    // 비동기 함수 호출
    getData();
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
      getData();  // db에 저장했으면 list 새로고침
      setTitle('');
      setContents('');  // 제목, 내용 초기화 ux 추가
    } catch (error) {
      console.error('Error posting data:', error); // 에러 발생 시 에러 로그
    }
  };

  const handleItemPress = async (reportId) => {
    try {
      const response = await axios.get(`${apiUrl}/report/modify/${reportId}`);
        console.log(response.data); // 요청이 성공한 경우 응답 데이터 로그
    } catch (error) {
        console.error('Error fetching data:', error); // 에러 발생 시 에러 로그
    }
  };

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
      <View style={styles.reportList} id="reportList">
        <FlatList
          data={reports}
          renderItem={renderItem}
          keyExtractor={(item) => item.reportId.toString()}
        />
      </View>
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
  reportList: {
    position: 'flex',
    backgroundColor: 'white',
    marginBottom: 5,
    padding:10,
    borderRadius: 5,
    
  }
});

export default Report;
