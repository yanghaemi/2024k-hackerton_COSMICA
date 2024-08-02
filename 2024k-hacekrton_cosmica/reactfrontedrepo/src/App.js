import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import mainScreen from "./screens/main/MainScreen";
import Login from "./screens/companion/Login";
import Register from "./screens/companion/Register";
import CompanionList from "./screens/companion/CompanionList";
import AppointmentRegister from "./screens/companion/AppointmentRegister";

const Tab = createBottomTabNavigator();

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

function SamplePage() { //리액트 네이티브의 기본적인 구조를 확인하고자 만들어둔 샘플 페이지입니다
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        <SafeAreaView style={{ flex: 1 }} //flex: 1로 하면 전체화면을 차지한다고 합니다
        >
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
                <Tab.Screen name="CompanionList" component={CompanionList} />
                <Tab.Screen name="AppointmentRegister" component={AppointmentRegister} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({ //style 참고용
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

export default App