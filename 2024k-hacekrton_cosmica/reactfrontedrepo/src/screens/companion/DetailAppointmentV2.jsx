import React from 'react';
import { ScrollView, View, Text, Image, TextInput, Button, StyleSheet } from 'react-native';

const App = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>

        {/* Title */}
        <Text style={styles.title}>동행자</Text>

        {/* Personal Information */}
        <View style={styles.tableLayout}>
          <View style={styles.tableRow}>
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{ uri: 'https://via.placeholder.com/100' }} // Placeholder image URL
              />
            </View>
            <View style={styles.infoContainer}>
              <TextInput
                style={styles.input}
                placeholder="한글이름"
              />
              <TextInput
                style={styles.input}
                placeholder="휴대폰"
              />
              <TextInput
                style={styles.input}
                placeholder="주소"
              />
              <TextInput
                style={styles.input}
                placeholder="날짜"
              />
              <TextInput
                style={styles.input}
                placeholder="비용"
              />
            </View>
          </View>
        </View>

        {/* 학력 Section */}
        <Text style={styles.sectionTitle}>등급</Text>
        <View style={styles.tableLayout}>
          <View style={styles.tableRow}>
            <TextInput
              style={styles.input}
              placeholder="2등급"
            />
          </View>
        </View>

        {/* 경력 Section */}
        <Text style={styles.sectionTitle}>횟수</Text>
        <View style={styles.tableLayout}>
          <View style={styles.tableRow}>
            <TextInput
              style={styles.input}
              placeholder="4번"
            />
          </View>
        </View>

        {/* 수상 및 자격증 Section */}
        <Text style={styles.sectionTitle}>동행자 리뷰</Text>
        <View style={styles.tableLayout}>
          <View style={styles.tableRow}>
            <TextInput
              style={styles.input}
              placeholder="리뷰내용"
            />
          </View>
        </View>

        {/* Button */}
        <Button
          title="신청 하기"
          color="#ffffff"
          onPress={() => {}}
        />

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  tableLayout: {
    marginBottom: 16,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imageContainer: {
    padding: 8,
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: 'darkgray',
  },
  infoContainer: {
    flex: 1,
    padding: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 18,
    paddingTop: 16,
    paddingBottom: 8,
  },
});

export default App;
