import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainScreen from './screens/main/MainScreen.js';
import SearchScreen from './screens/main/SearchScreen.js';
import MyPage from './screens/mypage/MyPage.js';
import Login from './screens/companion/loginregister/Login.jsx';
import Register from './screens/companion/loginregister/Register.jsx';
import CompanionStack from "./screens/companion/CompanionStack.tsx";
import Report from './screens/main/Report.js';
import { REACT_APP_LOCAL_API_URL } from '@env';
import fetchFunc3 from "./screens/companion/fetch/FetchFunc3";
import {Alert} from "react-native";

const Tab = createBottomTabNavigator(); //탭 네비
const Stack = createNativeStackNavigator(); //스택 네비


const MainStackNavigator = () => { //map 페이지에서 길찾기 화면으로 이동할 때 사용할 스택네비게이션
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen name="Map" options={{ headerShown: false }} children={() => <MainScreen apiUrl={REACT_APP_LOCAL_API_URL} />}/>
      <Stack.Screen name="길 찾기" component={SearchScreen} />
    </Stack.Navigator>
  );
};

function MyTabs() { //로그인 이후 보이는 화면
  return (
    <Tab.Navigator>
      <Tab.Screen name="지도" component={MainStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="동행자 매칭" component={CompanionStack}
                        //   listeners={({ navigation }) => ({
                        //     tabPress: e => {
                        //         e.preventDefault(); // Prevent default action first
                        //         fetchFunc3("/users/myInfo")
                        //             .then(userInfo => {
                        //                 console.log("userInfo: ",userInfo);
                        //                 if (userInfo) {
                        //                     navigation.navigate('동행자 매칭');
                        //                 } else {
                        //                     Alert.alert("로그인이 필요한 서비스입니다.")
                        //                     navigation.navigate('Login');
                        //                 }
                        //             })
                        //             .catch(error => {
                        //                 Alert.alert("서버에 문제가 생겼습니다 나중에 다시 이용해주세요.")
                        //                 console.error('Error:', error);
                        //                 navigation.navigate('Login');
                        //             });
                        //     },
                        // })}
                    />
      <Tab.Screen name="마이페이지" //확인용 마이페이지
      component={MyPage}
      options={{ headerShown: true }} />
    </Tab.Navigator>
  )
}


function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 관리하는 state

  // 로그인 상태에 따라 렌더링할 화면을 결정
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? ( //로그인 성공 시 보이는 화면
          <>
            <Stack.Screen name="Tabs" component={MyTabs} options={{ headerShown: false }} />
            <Stack.Screen name="Report" children={() => <Report apiUrl={REACT_APP_LOCAL_API_URL} />} />
          </>
        ) : ( //로그인 화면이 처음 페이지에 나타나도록 함
          <>
            <Stack.Screen name="로그인">
              {props => <Login {...props} onLoginSuccess={() => setIsLoggedIn(true)} />}
            </Stack.Screen>
            <Stack.Screen name="Register">
              {props => <Register {...props} onLoginSuccess={() => setIsLoggedIn(true)}/>}
              </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function App() {
  return <AppNavigator />;
}



export default App;
