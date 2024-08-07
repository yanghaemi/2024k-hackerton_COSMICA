import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainScreen from './screens/main/MainScreen';
import SearchScreen from './screens/main/SearchScreen';
import MyPage from './screens/mypage/MyPage';
import Login from './screens/companion/loginregister/Login';
import Register from './screens/companion/loginregister/Register';
import CompanionStack from "./screens/companion/CompanionStack.tsx";

const Tab = createBottomTabNavigator(); //탭 네비
const Stack = createNativeStackNavigator(); //스택 네비

const MainStackNavigator = () => { //map 페이지에서 길찾기 화면으로 이동할 때 사용할 스택네비게이션
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen name="Map" component={MainScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
    </Stack.Navigator>
  );
};

function App(){

  return (
    <NavigationContainer>
    <Tab.Navigator>
      <Tab.Screen name="Main" //여기다가 지도 넣을 예정
      component={MainStackNavigator}
      options={{ headerShown: false }} />
      <Tab.Screen name="Login" component={Login} />
      <Tab.Screen name="Register" component={Register} />
      <Tab.Screen name="Companion" component={CompanionStack} />
      <Tab.Screen name="마이페이지" //확인용 마이페이지
      component={MyPage}
      options={{ headerShown: true }} />
    </Tab.Navigator>
  </NavigationContainer>
  );
}



export default App;
