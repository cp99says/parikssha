import * as React from "react";

import {useIsFocused} from "@react-navigation/native";

import {Alert, Dimensions, StatusBar, PixelRatio, Platform, ToastAndroid} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import PushNotification, {Importance} from "react-native-push-notification";

export const showNotification = str => {
    if (Platform.OS == "android") {
        ToastAndroid.show(str, ToastAndroid.LONG);
    }
    if (Platform.OS == "ios") {
        Alert.alert(str);
    }
};

export const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        console.log(e);
    }
};

export const getData = async key => {
    try {
        return await AsyncStorage.getItem(key);
    } catch (e) {
        console.log(e);
    }
};

export const removeItem = async key => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {
        console.log(e);
    }
};

export const clearData = async () => {
    await AsyncStorage.clear();
};

export function FocusAwareStatusBar(props) {
    const isFocused = useIsFocused();
    return isFocused ? <StatusBar {...props} /> : null;
}

export async function localNotification(message) {
    PushNotification.createChannel(
        {
            channelId: "channel-id",
            channelName: "My channel",
            channelDescription: "A channel to categorise your notifications",
            playSound: false,
            soundName: "default",
            importance: Importance.HIGH,
            vibrate: true,
        },
        created => {
            PushNotification.getChannels(function (channel_ids) {
                var channelID = null;
                channelID = channel_ids[0]; // ['channel_id_1']

                PushNotification.localNotification({
                    channelId: channelID,
                    autoCancel: true,
                    title: "Exam Status",
                    message: message,
                    vibrate: true,
                    vibration: 300,
                    playSound: true,
                    soundName: "default",
                });
            });
        }
    );
}
