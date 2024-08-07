import React from 'react';
import { useColorScheme, SafeAreaView, ScrollView, StatusBar, Text, View, StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import mainScreen from './screens/main/MainScreen';
import Login from './screens/companion/loginregister/Login';
import Register from './screens/companion/loginregister/Register';
import CompanionStack from "./screens/companion/CompanionStack.tsx";

const Tab = createBottomTabNavigator();

function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Main" component={mainScreen} />
                <Tab.Screen name="Login" component={Login} />
                <Tab.Screen name="Register" component={Register} />
                <Tab.Screen name="Companion" component={CompanionStack} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}


export default App;
