import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainScreen from './screens/main/MainScreen.js';
import SearchScreen from './screens/main/SearchScreen.js';
import MyPage from './screens/mypage/MyPage.js';
import Login from './loginregister/Login.jsx';
import Register from './loginregister/Register.jsx';
import CompanionStack from "./screens/companion/CompanionStack.tsx";
import Report from './screens/main/Report.js';
import { REACT_APP_LOCAL_API_URL } from '@env';
import {REACT_APP_SPRING_API_URL} from '@env';
import fetchFunc3 from "./screens/companion/fetch/FetchFunc3";
import {Alert} from "react-native";

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

function App() {
  useEffect(() => {
    console.log(REACT_APP_LOCAL_API_URL);
    console.log(REACT_APP_SPRING_API_URL)// 환경 변수가 올바르게 로드되었는지 확인
  }, [REACT_APP_LOCAL_API_URL]);

  return (
    <NavigationContainer>
    <Tab.Navigator>
      <Tab.Screen name="Main" //여기다가 지도 넣을 예정
      component={MainStackNavigator}
      options={{ headerShown: false }} />
      <Tab.Screen name="Login" component={Login} />
      <Tab.Screen name="Register" component={Register} />
      <Tab.Screen name="Companion" component={CompanionStack}
                          listeners={({ navigation }) => ({
                            tabPress: e => {
                                e.preventDefault(); // Prevent default action first
                                fetchFunc3("/users/myInfo")
                                    .then(userInfo => {
                                        console.log("userInfo: ",userInfo);
                                        if (userInfo) {
                                            navigation.navigate('Companion');
                                        } else {
                                            Alert.alert("로그인이 필요한 서비스입니다.")
                                            navigation.navigate('Login');
                                        }
                                    })
                                    .catch(error => {
                                        Alert.alert("서버에 문제가 생겼습니다 나중에 다시 이용해주세요.")
                                        console.error('Error:', error);
                                        navigation.navigate('Login');
                                    });
                            },
                        })}
                    />
      <Tab.Screen name="Report" children={() => <Report apiUrl={REACT_APP_LOCAL_API_URL} />} />
      <Tab.Screen name="마이페이지" //확인용 마이페이지
      component={MyPage}
      options={{ headerShown: true }} />
    </Tab.Navigator>
  </NavigationContainer>
  );
}



export default App;
