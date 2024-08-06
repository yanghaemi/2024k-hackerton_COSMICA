import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Colors} from 'react-native/Libraries/NewAppScreen';

function Section({children, title}){ //리액트에서 기본으로 제공한 예시 함수
    const isDarkMode = useColorScheme() === 'dark';
    return (
      <View style={styles.sectionContainer}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: isDarkMode ? Colors.white : Colors.black,
            },
          ]}>
          {title}
        </Text>
        <Text
          style={[
            styles.sectionDescription,
            {
              color: isDarkMode ? Colors.light : Colors.dark,
            },
          ]}>
          {children}
        </Text>
      </View>
    );
  }
  
  const SamplePage= () =>{ //리액트 네이티브의 기본적인 구조를 확인하고자 만들어둔 샘플 페이지입니다
    const isDarkMode = useColorScheme() === 'dark';
  
    const backgroundStyle = {
      backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };
  
    return (
      <SafeAreaView style={{ flex: 1 }} //flex: 1로 하면 전체화면을 차지한다고 합니다
      > 
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}
        >
          <View
            style={{
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
              flex: 1,
            }}
          >
            <Section title="How to make page">
              This is <Text style={styles.highlight}>Sample</Text>{'\n'}
              Please refer to this{'\n'}
            </Section>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
    )
  }

  const styles = StyleSheet.create({ //style 참고용
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
    },
    highlight: {
      fontWeight: '700',
    },
  });

  export default SamplePage;