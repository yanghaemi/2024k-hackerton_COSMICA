import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './screens/main/MainScreen';
import SearchScreen from './screens/main/SearchScreen';
import CompanionStack from "./screens/companion/CompanionStack";
import Report from './screens/main/Report';
import MyPageStack from "./screens/mypage/MyPageStack";
import RouteAdd from "./screens/main/route/RouteAdd.js";
import AddScreen from "./screens/main/route/AddScreen.js";
import BusStack from "./screens/Bus/BusStack";
import { REACT_APP_LOCAL_API_URL } from '@env';
import { Alert } from 'react-native';
import fetchFunc4 from "./fetch/FetchFunc4";
import CustomComponent from './components/CustomComponent'; // CustomComponent import

const Stack = createNativeStackNavigator(); // 스택 네비게이션

const MainStackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Map">
            <Stack.Screen name="Map" children={() => <MainScreen apiUrl={REACT_APP_LOCAL_API_URL} />} />
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


const App = () => {
    useEffect(() => {
        // 환경 변수가 올바르게 로드되었는지 확인
        // console.log(REACT_APP_LOCAL_API_URL);
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator>

                <Stack.Screen name="MainStack" component={MainStackNavigator} options={{ headerShown: false }} />
                <Stack.Screen name="CompanionStack" component={CompanionStack} options={{ headerShown: false }} />
                <Stack.Screen name="MyPageStack" component={MyPageStack} options={{ headerShown: false }} />
                <Stack.Screen name="BusStack" component={BusStack} options={{ headerShown: false }} />
                <Stack.Screen name="Report" children={() => <Report apiUrl={REACT_APP_LOCAL_API_URL} />} />
                <Stack.Screen name="CustomComponent" component={CustomComponent} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
