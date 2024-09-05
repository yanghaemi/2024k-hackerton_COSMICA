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
            <Stack.Screen name="Map">
                {() => (
                    <ScreenWrapper>
                        <MainScreen apiUrl={REACT_APP_LOCAL_API_URL} />
                    </ScreenWrapper>
                )}
            </Stack.Screen>
            <Stack.Screen name="길 찾기">
                {() => (<SearchScreen />)}
            </Stack.Screen>
            <Stack.Screen name="Add">
                {() => (<RouteAddStackNavigator />)}
            </Stack.Screen>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
            <Stack.Screen name="CompanionStack" component={CompanionStack} options={{ headerShown: false }}/>
        </Stack.Navigator>
    );
};

const RouteAddStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="RouteAdd">
                {() => (<RouteAdd apiUrl={REACT_APP_LOCAL_API_URL} />)}
            </Stack.Screen>
            <Stack.Screen name="AddScreen">
                {() => (<AddScreen />)}
            </Stack.Screen>
        </Stack.Navigator>
    );
};

const App = () => {
    useEffect(() => {
        console.log("ad");
        console.log(REACT_APP_LOCAL_API_URL);
        console.log(REACT_APP_SPRING_API_URL);
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="MainStack" component={MainStackNavigator} options={{ headerShown: false }} />
                <Stack.Screen name="CompanionStack" component={CompanionStack} options={{ headerShown: false }} />
                <Stack.Screen name="MyPageStack" component={MyPageStack} options={{ headerShown: false }} />
                <Stack.Screen name="BusStack" component={BusStack} options={{ headerShown: false }} />
                <Stack.Screen name="Report">
                    {() => <ScreenWrapper><Report apiUrl={REACT_APP_LOCAL_API_URL} /></ScreenWrapper>}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
