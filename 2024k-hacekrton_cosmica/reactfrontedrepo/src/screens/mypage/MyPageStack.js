import AppointmentRegister from "../companion/AppointmentRegister";
import DetailAppointment from "../companion/DetailAppointment";
import CheckoutPage from "../companion/checkout/CheckoutPage";
import React from "react";
import MyPage from "./MyPage";
import {createStackNavigator} from "@react-navigation/stack";
import Login from "../../loginregister/Login";
import Register from "../../loginregister/Register";
const Stack = createStackNavigator();


function MyPageStack() {
    return (
            <Stack.Navigator>
                <Stack.Screen name="MyPage" component={MyPage} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
            </Stack.Navigator>
    );
}

export default MyPageStack;