import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainScreen from './screens/main/MainScreen';
import SearchScreen from './screens/main/SearchScreen';
import CompanionStack from "./screens/companion/CompanionStack.tsx";
import Report from './screens/main/Report';
import { REACT_APP_LOCAL_API_URL } from '@env';
import Login from "./loginregister/Login.jsx";
import Register from "./loginregister/Register";
import fetchFunc3 from "./screens/companion/fetch/FetchFunc3";
import {Alert} from "react-native";
import MyPageStack from "./screens/mypage/MyPageStack";
import RouteAdd from "./screens/main/route/RouteAdd.js";
import AddScreen from "./screens/main/route/AddScreen.js";
import MyPage from './screens/mypage/MyPage.js';
import MyRoute from './screens/mypage/MyRoute.js';

const Tab = createBottomTabNavigator(); //탭 네비
const Stack = createNativeStackNavigator(); //스택 네비

const MainStackNavigator = () => { //map 페이지에서 길찾기 화면으로 이동할 때 사용할 스택네비게이션
    return (
        <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="Map" children={() => <MainScreen apiUrl={REACT_APP_LOCAL_API_URL} />}/>
            <Stack.Screen name="Search" component={SearchScreen} />
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

const MypageStackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="My">
            <Stack.Screen name="MainMypage" component={MyPage}/>
            <Stack.Screen name="MyRoute" children={() => <MyRoute apiUrl={REACT_APP_LOCAL_API_URL} />}/>
        </Stack.Navigator>
    )
}


function MyTabs() {
    return (
        <Tab.Navigator>
            <Stack.Screen name="Login" component={Login} />
            <Tab.Screen name="Main" component={MainStackNavigator} options={{ headerShown: false }} />
            <Tab.Screen name="Companion" component={CompanionStack}
                listeners={({ navigation }) => ({
                    tabPress: e => handleCompanionTabPress(e, navigation)
                })}/>
            <Tab.Screen name="MyPage" component={MypageStackNavigator} options={{ headerShown: true }} />
                
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
        const userInfo = await fetchFunc3("/users/myInfo");
        console.log("userInfo: ", userInfo);
        if (userInfo) {
            navigation.navigate('Companion');
        } else {
            Alert.alert("로그인이 필요한 서비스입니다.");
            navigation.navigate('Login');
        }
    } catch (error) {
        Alert.alert("서버에 문제가 생겼습니다. 나중에 다시 이용해주세요.");
        console.error('Error:', error);
        navigation.navigate('Login');
    }
};


export default App;
// import Reactt, { useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import MainScreen from './screens/main/MainScreen';
// import SearchScreen from './screens/main/SearchScreen';
// import MyPage from './screens/mypage/MyPage';
// import Login from './screens/companion/loginregister/Login';
// import Register from './screens/companion/loginregister/Register';
// import CompanionStack from "./screens/companion/CompanionStack.tsx";
// import Report from './screens/main/Report';
// import RouteAdd from './screens/main/RouteAdd.js'
// import { REACT_APP_LOCAL_API_URL } from '@env';
// import test from './screens/main/test.js'

// const Tab = createBottomTabNavigator(); //탭 네비
// const Stack = createNativeStackNavigator(); //스택 네비

// const MainStackNavigator = () => { //map 페이지에서 길찾기 화면으로 이동할 때 사용할 스택네비게이션
//   return (
//     <Stack.Navigator initialRouteName="Main">
//       <Stack.Screen name="Map" children={() => <MainScreen apiUrl={REACT_APP_LOCAL_API_URL} />}/>
//       <Stack.Screen name="Search" component={SearchScreen} />
//     </Stack.Navigator>
//   );
// };

// function MyTabs() {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen name="Login" children={() => <Login apiUrl={REACT_APP_LOCAL_API_URL} />}/>
//       <Tab.Screen name="Main" component={MainStackNavigator} options={{ headerShown: false }} />
//       <Tab.Screen name="Register" component={Register} />
//       <Tab.Screen name="Companion" component={CompanionStack} />
//       <Tab.Screen name="test" //확인용 마이페이지
//       component={test}
//       options={{ headerShown: true }} />
//     </Tab.Navigator>
//   )
// }

// function App() {
//   useEffect(() => {
//     // console.log(REACT_APP_LOCAL_API_URL); // 환경 변수가 올바르게 로드되었는지 확인
//   }, [REACT_APP_LOCAL_API_URL]);

//   return (
//     <NavigationContainer>
//     <Stack.Navigator>
//       <Stack.Screen name="Tabs" component={MyTabs} options={{ headerShown: false }} />
//       <Stack.Screen name="Report" children={() => <Report apiUrl={REACT_APP_LOCAL_API_URL} />} />
//       <Stack.Screen name="RouteAdd" children={() => <RouteAdd apiUrl={REACT_APP_LOCAL_API_URL} />} />
//     </Stack.Navigator>
//   </NavigationContainer>
//   );
// }



// export default App;
