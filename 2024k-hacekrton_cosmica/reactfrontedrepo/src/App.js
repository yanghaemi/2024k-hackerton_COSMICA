import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import mainScreen from "./screens/main/MainScreen";
import Login from "./screens/companion/Login";
import Register from "./screens/companion/Register";
import CompanionList from "./screens/companion/CompanionList";
import AppointmentRegister from "./screens/companion/AppointmentRegister";
import DetailAppointment from "./screens/companion/DetailAppointment";
import CheckoutPage from "./screens/companion/CheckoutPage";


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function CompanionStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="CompanionList" component={CompanionList} />
            <Stack.Screen name="DetailAppointment" component={DetailAppointment} />
            <Stack.Screen name="AppointmentRegister" component={AppointmentRegister} />
            <Stack.Screen name="CheckoutPage" component={CheckoutPage} />
        </Stack.Navigator>
    );
}

function Section({ children, title }) {
    const isDarkMode = useColorScheme() === 'dark';
    return (
        <View style={styles.sectionContainer}>
            <Text
                style={[
                    styles.sectionTitle,
                    {
                        color: isDarkMode ? Colors.white : Colors.black,
                    },
                ]}>
                {title}
            </Text>
            <Text
                style={[
                    styles.sectionDescription,
                    {
                        color: isDarkMode ? Colors.light : Colors.dark,
                    },
                ]}>
                {children}
            </Text>
        </View>
    );
}

function SamplePage() {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <View>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={backgroundStyle}
                >
                    <View
                        style={{
                            backgroundColor: isDarkMode ? Colors.black : Colors.white,
                            flex: 1,
                        }}
                    >
                        <Section title="How to make page">
                            This is <Text style={styles.highlight}>Sample</Text>{'\n'}
                            Please refer to this{'\n'}
                        </Section>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Sample" component={SamplePage} options={{ headerShown: false }} />
                <Tab.Screen name="Main" component={mainScreen} />
                <Tab.Screen name="Login" component={Login} />
                <Tab.Screen name="Register" component={Register} />
                <Tab.Screen name="Companion" component={CompanionStack} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});

export default App;
