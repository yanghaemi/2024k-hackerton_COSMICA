import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainScreen from './screens/main/MainScreen';
import SearchScreen from './screens/main/SearchScreen';
import SamplePage from './screens/SamplePage'

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
    </Stack.Navigator>
  );
};

function App(){

  return (
    <NavigationContainer>
    <Tab.Navigator>
      <Tab.Screen name="Sample"//제일 첫번째로 보이는 화면
       component={SamplePage} //현재는 일단 샘플로 만들어둔 페이지로 지정해놨습니다
        options={{ headerShown: false }} />
      <Tab.Screen name="Main" //여기다가 지도 넣을 예정
      component={MainStackNavigator}
      options={{ headerShown: false }} />
    </Tab.Navigator>
  </NavigationContainer>
  );
}



export default App;
