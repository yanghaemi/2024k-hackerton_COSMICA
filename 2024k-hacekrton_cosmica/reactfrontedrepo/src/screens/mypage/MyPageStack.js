import AppointmentRegister from "../companion/AppointmentRegister";
import DetailAppointment from "../companion/DetailAppointment";
import CheckoutPage from "../companion/checkout/CheckoutPage";
import React from "react";
import MyPage from "./MyPage";
import {createStackNavigator} from "@react-navigation/stack";
import Login from "./loginregister/Login";
import Register from "./loginregister/Register";
import CompanionStack from "../companion/CompanionStack";
import MyReview from "./MyReview";
const Stack = createStackNavigator();


function MyPageStack() {
    return (
            <Stack.Navigator>
                <Stack.Screen name="MyPage" component={MyPage} options={{ headerShown: false }}/>
                <Stack.Screen name="MyReview" component={MyReview} options={{headerShown:false}}/>
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
                <Stack.Screen name="Register" component={Register} options={{ headerShown: false }}/>
                <Stack.Screen name="CompanionStack" component={CompanionStack} options={{ headerShown: false }}/>
            </Stack.Navigator>
    );
}

export default MyPageStack;