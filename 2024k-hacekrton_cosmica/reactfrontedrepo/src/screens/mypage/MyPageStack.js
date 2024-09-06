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
import CalendarPage from "../companion/CalendarPage";
import {PaymentWidgetProvider} from "@tosspayments/widget-sdk-react-native";
const Stack = createStackNavigator();


function MyPageStack() {
    return (
        <PaymentWidgetProvider clientKey={`test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm`} customerKey={`IYb3-UCpCttZa4-GAj3sd`}>
        <Stack.Navigator>
                <Stack.Screen name="MyPage" component={MyPage} options={{ headerShown: false }}/>
                <Stack.Screen name="MyReview" component={MyReview} options={{headerShown:false}}/>
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
                <Stack.Screen name="Register" component={Register} options={{ headerShown: false }}/>
                <Stack.Screen name="CheckoutPage" component={CheckoutPage} options={{ headerShown: false }}/>
                <Stack.Screen name="AppointmentRegister" component={AppointmentRegister} options={{ headerShown: false }}/>
                <Stack.Screen name="DetailAppointment" component={DetailAppointment} options={{ headerShown: false }}/>
                <Stack.Screen name="CalendarPage" component={CalendarPage} options={{ headerShown: false }}/>
            </Stack.Navigator>
        </PaymentWidgetProvider>

    );
}

export default MyPageStack;