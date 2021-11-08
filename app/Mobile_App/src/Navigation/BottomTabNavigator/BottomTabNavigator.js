import React, {useEffect, useRef} from "react";
import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {ExamStackNavigator} from "../HomeNavigators/ExamNavigator";
import Icon, {Icons} from "../../Components/Icons";
import {COLORS} from "../../Constants/GlobalStyle";
import * as Animatable from "react-native-animatable";
import {HomeStackNavigator} from "../HomeNavigators/HomeNavigator";
import AccountScreen from "../../Screens/AccountScreens/Account";

const Tab = createBottomTabNavigator();
const animateVal1 = {0: {scale: 0.8, translateY: 0}, 1: {scale: 1.2, translateY: -22}};
const animateVal2 = {0: {scale: 1.2, translateY: -22}, 1: {scale: 1, translateY: 0}};
const circleVal1 = {
    0: {scale: 0},
    0.3: {scale: 0.35},
    0.5: {scale: 0.65},
    0.8: {scale: 0.95},
    1: {scale: 1},
};
const circleVal2 = {
    0: {scale: 1},
    1: {scale: 0},
};

function TabBarButton(props) {
    const viewRef = useRef(null);
    const circleRef = useRef(null);

    const textRef = useRef(null);

    const {item, onPress, accessibilityState} = props;
    const focused = accessibilityState.selected;
    useEffect(() => {
        if (focused) {
            viewRef.current.animate(animateVal1);
            circleRef.current.animate(circleVal1);
            textRef.current.transitionTo({scale: 1});
        } else {
            viewRef.current.animate(animateVal2);
            circleRef.current.animate(circleVal2);
            textRef.current.transitionTo({scale: 0});
        }
    }, [focused]);
    return (
        <TouchableOpacity style={styles.buttonContainerStyle} onPress={onPress}>
            <Animatable.View
                animation={"zoomIn"}
                duration={1200}
                ref={viewRef}
                style={styles.buttonContainerStyle}
            >
                <View style={styles.tabBtn}>
                    <Animatable.View
                        ref={circleRef}
                        style={{
                            ...StyleSheet.absoluteFillObject,
                            backgroundColor: COLORS.PURPLE_LIGHT,
                            borderRadius: 50 / 2,
                        }}
                    />
                    <Icon
                        type={item.type}
                        name={item.activeIcon}
                        color={focused ? COLORS.WHITE : COLORS.PURPLE_LIGHT}
                    />
                </View>

                <Animatable.Text
                    ref={textRef}
                    style={{fontSize: 10, color: COLORS.PURPLE_LIGHT, textAlign: "center"}}
                >
                    {item.label}
                </Animatable.Text>
            </Animatable.View>
        </TouchableOpacity>
    );
}
const TabArr = [
    {
        route: "Home",
        label: "Home",
        type: Icons.MaterialIcons,
        activeIcon: "dashboard",
        inActiveIcon: "grid-outline",
        component: HomeStackNavigator,
    },
    {
        route: "examsList",
        label: "History",
        type: Icons.MaterialCommunityIcons,
        activeIcon: "history",
        inActiveIcon: "heart-plus-outline",
        component: ExamStackNavigator,
    },
    {
        route: "account",
        label: "Account",
        type: Icons.MaterialCommunityIcons,
        activeIcon: "account",
        inActiveIcon: "timeline-plus-outline",
        component: AccountScreen,
    },
];
export function BottomTab() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    height: 65,
                    position: "absolute",
                    left: 15,
                    right: 15,
                    bottom: 15,
                    borderRadius: 10,
                },
            }}
        >
            {TabArr.map((item, index) => {
                return (
                    <Tab.Screen
                        key={index}
                        name={item.route}
                        component={item.component}
                        options={{
                            tabBarLabel: item.label,
                            tabBarIcon: ({focused, color}) => (
                                <Icon
                                    type={item.type}
                                    name={focused ? item.activeIcon : item.inActiveIcon}
                                    color={color}
                                />
                            ),
                            tabBarButton: props => <TabBarButton {...props} item={item} />,
                        }}
                    />
                );
            })}
        </Tab.Navigator>
    );
}
const styles = StyleSheet.create({
    buttonContainerStyle: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    tabBtn: {
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
        borderWidth: 4,
        borderColor: COLORS.WHITE,
        backgroundColor: COLORS.WHITE,
        justifyContent: "center",
        alignItems: "center",
    },
});
