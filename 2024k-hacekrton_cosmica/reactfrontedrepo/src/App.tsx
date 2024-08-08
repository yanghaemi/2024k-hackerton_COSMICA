import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import mainScreen from './screens/main/MainScreen';
import Login from './screens/companion/loginregister/Login';
import Register from './screens/companion/loginregister/Register';
import CompanionStack from "./screens/companion/CompanionStack";
import fetchFunc3 from "./screens/companion/fetch/FetchFunc3";
import {Alert} from "react-native";

const Tab = createBottomTabNavigator();

function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Main" component={mainScreen} />
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
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default App;
