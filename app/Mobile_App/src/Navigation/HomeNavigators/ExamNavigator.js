import React from "react";
import {View} from "react-native";

import {createNativeStackNavigator} from "@react-navigation/native-stack";
import ExamsList from "../../Screens/ExamScreens/ExamsList";
import ExamPreview from "../../Screens/ExamScreens/ExamPreview";
import {COLORS} from "../../Constants/GlobalStyle";
const Stack = createNativeStackNavigator();

export function ExamStackNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTintColor: COLORS.WHITE,
                headerStyle: {
                    backgroundColor: COLORS.HEADER_GREY,
                },
            }}
        >
            <Stack.Screen
                options={{
                    title: "Exams History",
                }}
                name="ExamsList"
                component={ExamsList}
            />
            <Stack.Screen
                // options={{headerShown: false}}
                name="ExamPreview"
                component={ExamPreview}
                options={{
                    headerStyle: {
                        backgroundColor: COLORS.HEADER_GREY,
                    },
                    title: "Question Paper",
                    headerBackTitleStyle: {
                        backgroundColor: COLORS.WHITE,
                    },
                    headerTitleStyle: {
                        color: "#ffffff",
                        justifyContent: "center",
                        alignSelf: "center",
                    },
                }}
            />
        </Stack.Navigator>
    );
}
