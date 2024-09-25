import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './screens/main/MainScreen';
import SearchScreen from './screens/main/SearchScreen';
import CompanionStack from "./screens/companion/CompanionStack";
import Report from './screens/main/Report';
import MyPageStack from "./screens/mypage/MyPageStack";
import RouteAdd from "./screens/main/route/RouteAdd";
import AddScreen from "./screens/main/route/AddScreen";
import BusStack from "./screens/Bus/BusStack";
import { REACT_APP_LOCAL_API_URL, REACT_APP_SPRING_API_URL } from '@env';
import ScreenWrapper from './components/ScreenWrapper';
import Login from "./screens/mypage/loginregister/Login"; // 경로 확인

const Stack = createNativeStackNavigator();

const MainStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="지도">
                {() => (
                    <ScreenWrapper>
                        <MainScreen apiUrl={REACT_APP_LOCAL_API_URL} />
                    </ScreenWrapper>
                )}
            </Stack.Screen>
            <Stack.Screen name="길 찾기">
                {() => (<SearchScreen />)}
            </Stack.Screen>
            <Stack.Screen name="Add" options={{ headerShown: false }}>
                {() => (<RouteAddStackNavigator />)}
            </Stack.Screen>
            <Stack.Screen name="MyPageStack" component={MyPageStack} options={{ headerShown: false }} />
            <Stack.Screen name="CompanionStack" component={CompanionStack} options={{ headerShown: false }}/>
        </Stack.Navigator>
    );
};

const RouteAddStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="경로 추가">
                {() => (<RouteAdd apiUrl={REACT_APP_LOCAL_API_URL} />)}
            </Stack.Screen>
            <Stack.Screen name="새 경로 추가" >
                {() => (<AddScreen />)}
            </Stack.Screen>
        </Stack.Navigator>
    );
};

const App = () => {
    useEffect(() => {
        console.log("dlsj");
        console.log(REACT_APP_LOCAL_API_URL);
        console.log(REACT_APP_SPRING_API_URL);
        console.log('az')
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="MainStack" component={MainStackNavigator} options={{ headerShown: false }} />
                <Stack.Screen name="CompanionStack" component={CompanionStack} options={{ headerShown: false }} />
                <Stack.Screen name="MyPageStack" component={MyPageStack} options={{ headerShown: false }} />
                <Stack.Screen name="BusStack" component={BusStack} options={{ headerShown: false }} />
                <Stack.Screen name="신고">
                    {() => <ScreenWrapper><Report apiUrl={REACT_APP_LOCAL_API_URL} /></ScreenWrapper>}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
