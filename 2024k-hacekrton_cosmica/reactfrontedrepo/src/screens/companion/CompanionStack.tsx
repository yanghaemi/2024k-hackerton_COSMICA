import CalendarPage from "./CalendarPage";
import DetailAppointment from "./DetailAppointment";
import AppointmentRegister from "./AppointmentRegister";
import CheckoutPage from "./checkout/CheckoutPage.tsx";
import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import { PaymentWidgetProvider, usePaymentWidget, AgreementWidget, PaymentMethodWidget } from "@tosspayments/widget-sdk-react-native";

import MyPageStack from "../mypage/MyPageStack";
import MyPage from "../mypage/MyPage";
import MyReview from "../mypage/MyReview";
import Login from "../mypage/loginregister/Login";
import Register from "../mypage/loginregister/Register";
const Stack = createStackNavigator();


function CompanionStack() {
    return (
        <PaymentWidgetProvider clientKey={`test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm`} customerKey={`IYb3-UCpCttZa4-GAj3sd`}>
        <Stack.Navigator>
            <Stack.Screen name="CalendarPage" component={CalendarPage} options={{ headerShown: false }}/>
            <Stack.Screen name="MyPage" component={MyPage} options={{ headerShown: false }}/>
            <Stack.Screen name="MyReview" component={MyReview} options={{headerShown:false}}/>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }}/>
            <Stack.Screen name="CheckoutPage" component={CheckoutPage} options={{ headerShown: false }}/>
            <Stack.Screen name="AppointmentRegister" component={AppointmentRegister} options={{ headerShown: false }}/>
            <Stack.Screen name="DetailAppointment" component={DetailAppointment} options={{ headerShown: false }}/>
        </Stack.Navigator>
        </PaymentWidgetProvider>
    );
}

export default CompanionStack;