import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainScreen from './screens/main/MainScreen';
import Report from './screens/main/Report';
import { REACT_APP_LOCAL_API_URL } from '@env';

const Tab = createBottomTabNavigator();

function Section({ children, title }) {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

function SamplePage() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View>
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
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
  );
}

function App() {
  useEffect(() => {
    console.log(REACT_APP_LOCAL_API_URL); // 환경 변수가 올바르게 로드되었는지 확인
  }, [REACT_APP_LOCAL_API_URL]);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Sample" component={SamplePage} options={{ headerShown: false }} />
        <Tab.Screen name="Main" component={MainScreen} />
        <Tab.Screen name="Report" children={() => <Report apiUrl={REACT_APP_LOCAL_API_URL} />} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
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

export default App;
