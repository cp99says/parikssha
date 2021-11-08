import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import OnBoarding from "../../Screens/AuthScreens/OnBoarding";
import LoginScreen from "../../Screens/AuthScreens/Login";
import RegisterScreen from "../../Screens/AuthScreens/Register";

import {COLORS} from "../../Constants/GlobalStyle";

const Stack = createNativeStackNavigator();

export function AuthStackNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTintColor: COLORS.WHITE,
                headerStyle: {
                    backgroundColor: COLORS.HEADER_GREY,
                },
            }}
        >
            <Stack.Screen options={{headerShown: false}} name="OnBoarding" component={OnBoarding} />
            <Stack.Screen
                options={{
                    title: "Login",
                }}
                name="LoginScreen"
                component={LoginScreen}
            />
            <Stack.Screen
                options={{
                    title: "Register",
                }}
                name="RegisterScreen"
                component={RegisterScreen}
            />
        </Stack.Navigator>
    );
}
