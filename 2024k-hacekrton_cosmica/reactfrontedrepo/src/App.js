import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainScreen from './screens/main/MainScreen';
import SearchScreen from './screens/main/SearchScreen';
import CompanionStack from "./screens/companion/CompanionStack.tsx";
import Report from './screens/main/Report';
import { REACT_APP_LOCAL_API_URL } from '@env';
import {Alert} from "react-native";
import MyPageStack from "./screens/mypage/MyPageStack";
import RouteAdd from "./screens/main/route/RouteAdd.js";
import AddScreen from "./screens/main/route/AddScreen.js";
import BusStack from "./screens/Bus/BusStack";
import fetchFunc4 from "./fetch/FetchFunc4";

const Tab = createBottomTabNavigator(); //탭 네비
const Stack = createNativeStackNavigator(); //스택 네비

const MainStackNavigator = () => { //map 페이지에서 길찾기 화면으로 이동할 때 사용할 스택네비게이션
    return (
        <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="Map" children={() => <MainScreen apiUrl={REACT_APP_LOCAL_API_URL} />}/>
            <Stack.Screen name="길 찾기" component={SearchScreen} />
            <Stack.Screen name="Add" component={RouteAddStackNavigator} options={{ headerShown: false }}/>
        </Stack.Navigator>
    );
};

const RouteAddStackNavigator = () => { //RouteAdd 페이지에서 길찾기 화면으로 이동할 때 사용할 스택네비게이션
    return (
        <Stack.Navigator initialRouteName="Add">
            <Stack.Screen name="RouteAdd" children={() => <RouteAdd apiUrl={REACT_APP_LOCAL_API_URL} />}/>
            <Stack.Screen name="AddScreen" component={AddScreen} />
            
        </Stack.Navigator>
    );
};


function MyTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Main" component={MainStackNavigator} options={{ headerShown: false }} />
            <Tab.Screen name="동행자 매칭" component={CompanionStack} options={{ headerShown: false }}
                        listeners={({ navigation }) => ({
                            tabPress: e => handleCompanionTabPress(e, navigation)
                        })}/>
            <Tab.Screen name="마이페이지" component={MyPageStack} options={{ headerShown: false }} />
            <Tab.Screen name = "버스" component={BusStack} options={{ headerShown: false }}/>
        </Tab.Navigator>
    );
}

function App() {
    useEffect(() => {
        // console.log(REACT_APP_LOCAL_API_URL); // 환경 변수가 올바르게 로드되었는지 확인
    }, [REACT_APP_LOCAL_API_URL]);

    return (
        <NavigationContainer>
            <Stack.Navigator>

                <Stack.Screen name="Tabs" component={MyTabs} options={{ headerShown: false }} />
                <Stack.Screen name="Report" children={() => <Report apiUrl={REACT_APP_LOCAL_API_URL} />} />
                
            </Stack.Navigator>
        </NavigationContainer>
    );
}


const handleCompanionTabPress = async (e, navigation) => {
    e.preventDefault(); // Prevent default action first

    try {
        const userInfo = await fetchFunc4("/users/myInfo");
        console.log("userInfo: ", userInfo);
        if (userInfo.status===401 ||userInfo.status===400) {
            Alert.alert("로그인이 필요한 서비스입니다.");
            navigation.navigate('Login');
        } else {
            navigation.navigate('CompanionStack');
        }
    } catch (error) {
        Alert.alert("서버에 문제가 생겼습니다. 나중에 다시 이용해주세요.");
        console.error('Error:', error);
        navigation.navigate('Login');
    }
};


export default App;