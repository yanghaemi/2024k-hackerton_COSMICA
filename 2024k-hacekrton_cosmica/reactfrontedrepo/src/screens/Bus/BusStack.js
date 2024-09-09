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
import BusRoute from "./BusRoute";

function BusStack() {

    const Stack = createStackNavigator();
    return (
            <Stack.Navigator>
                <Stack.Screen name={"BusMain"} component={BusStopSearchScreen} options={{ headerShown: false }}/>
                <Stack.Screen name={"Bus"} component={Bus} options={{ headerShown: false }}/>
                <Stack.Screen name={"BusRoute"} component={BusRoute} options={{headerShown: false}}/>
            </Stack.Navigator>
    );
}

export default BusStack;