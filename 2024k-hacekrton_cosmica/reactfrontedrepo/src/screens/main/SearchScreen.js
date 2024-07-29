import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_API_KEY } from '@env';

const SearchScreen = () => {
  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="장소를 검색하세요"
        onPress={(data, details = null) => {
          // 선택한 장소에 대한 처리
          console.log(data, details);
        }}
        query={{
          key: GOOGLE_MAPS_API_KEY,
          language: 'ko', // 언어 설정
        }}
        fetchDetails={true} // 장소의 세부정보를 가져옴
        styles={{
          textInputContainer: styles.searchContainer,
          textInput: styles.searchInput,
          listView: styles.suggestionList,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 3,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  suggestionList: {
    backgroundColor: 'white',
  },
});

export default SearchScreen;
