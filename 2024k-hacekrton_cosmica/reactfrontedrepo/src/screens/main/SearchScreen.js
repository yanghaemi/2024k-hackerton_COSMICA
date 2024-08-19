import React, { useState } from 'react';
import { StyleSheet, View, Button, Alert } from 'react-native';
import { GooglePlacesAutocomplete  } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { useNavigation } from '@react-navigation/native';

const SearchScreen = () => {
  const navigation = useNavigation();

  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);


  const handleNavigate = () => {
    if (origin && destination) {
      navigation.navigate('Map', { origin, destination }); //Main스크린 이동 및 출발지와 도착지 정보 보냄
    } else {
      Alert.alert('경고', '두 장소를 모두 선택해야 합니다.');
    }
  };

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete //검색창
        placeholder="출발지 입력"
        onPress={(data, details = null) => {
          setOrigin({ //출발지 정보 저장
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            name: data.description,
          });

        }}
        query={{
          key: GOOGLE_MAPS_API_KEY,
          language: 'ko', // 한국어
        }}
        fetchDetails={true}
        listViewDisplayed={true} // 목록
        styles={styles.search}
      />
      <GooglePlacesAutocomplete //검색 창
        placeholder="도착지 입력"
        onPress={(data, details = null) => {
          setDestination({ //도착지 정보 저장
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            name: data.description,
          });
        }}
        query={{
          key: GOOGLE_MAPS_API_KEY,
          language: 'ko',// 한국어
        }}
        fetchDetails={true}
        listViewDisplayed={true} // 목록
        styles={styles.search}
      />
      <Button title="경로 찾기" onPress={handleNavigate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  search: {
    textInputContainer: {
      backgroundColor: 'white',
      borderRadius: 5,
      elevation: 3,
      marginBottom: 10,
    },
    textInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      paddingHorizontal: 10,
    },
  },
});

export default SearchScreen;
