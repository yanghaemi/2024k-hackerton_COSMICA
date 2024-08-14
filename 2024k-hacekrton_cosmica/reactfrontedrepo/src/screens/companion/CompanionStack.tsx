import CalendarPage from "./CalendarPage";
import DetailAppointment from "./DetailAppointment";
import AppointmentRegister from "./AppointmentRegister";
import CheckoutPage from "./checkout/CheckoutPage.tsx";
import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import { PaymentWidgetProvider, usePaymentWidget, AgreementWidget, PaymentMethodWidget } from "@tosspayments/widget-sdk-react-native";
import mainScreen from "../main/MainScreen";
const Stack = createStackNavigator();


function CompanionStack() {
    return (
        <PaymentWidgetProvider clientKey={`test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm`} customerKey={`IYb3-UCpCttZa4-GAj3sd`}>
        <Stack.Navigator>
            <Stack.Screen name="CalendarPage" component={CalendarPage} />
            <Stack.Screen name="AppointmentRegister" component={AppointmentRegister} />
            <Stack.Screen name="DetailAppointment" component={DetailAppointment} />
            <Stack.Screen name="CheckoutPage" component={CheckoutPage} />
        </Stack.Navigator>
        </PaymentWidgetProvider>
    );
}

export default CompanionStack;