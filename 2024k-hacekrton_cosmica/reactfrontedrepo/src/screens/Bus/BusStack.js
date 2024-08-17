import {PaymentWidgetProvider} from "@tosspayments/widget-sdk-react-native";
import CalendarPage from "../companion/CalendarPage";
import AppointmentRegister from "../companion/AppointmentRegister";
import DetailAppointment from "../companion/DetailAppointment";
import CheckoutPage from "../companion/checkout/CheckoutPage";
import React from "react";
import {useNavigation} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import BusStopSearchScreen from "./BusStop";
import Bus from "./Bus";

function BusStack() {

    const Stack = createStackNavigator();
    const navigation = useNavigation();
    return (
            <Stack.Navigator>
                <Stack.Screen name={"BusMain"} component={BusStopSearchScreen} options={{ headerShown: false }}/>
                <Stack.Screen name={"Bus"} component={Bus} options={{ headerShown: false }}/>
            </Stack.Navigator>
    );
}

export default BusStack;