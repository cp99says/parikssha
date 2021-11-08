import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import HomeScreen from "../../Screens/HomeScreens/HomeScreen";
import SubjectScreen from "../../Screens/HomeScreens/SubjectScreen";
import SubjectExamPreview from "../../Screens/HomeScreens/SubjectExamPreview";

import {COLORS} from "../../Constants/GlobalStyle";

const Stack = createNativeStackNavigator();

export function HomeStackNavigator() {
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
                options={{headerShown: false}}
                name="HomeScreens"
                component={HomeScreen}
            />
            <Stack.Screen
                options={({route}) => ({
                    headerTitle: route.params.data,
                })}
                name="SubjectScreen"
                component={SubjectScreen}
            />
            <Stack.Screen
                options={({route}) => ({
                    headerTitle: "Exam Details",
                })}
                name="SubjectExamPreview"
                component={SubjectExamPreview}
            />
        </Stack.Navigator>
    );
}
