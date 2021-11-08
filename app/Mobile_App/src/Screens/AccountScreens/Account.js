import React, {useEffect, useRef} from "react";
import {Text, View, StyleSheet, TouchableOpacity, Button} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Store from "../../Store/Store";

export default function AccountScreen() {
    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Button
                title={"Log Out"}
                onPress={() => {
                    AsyncStorage.clear();
                    Store.setAuthTokenVal(0);
                }}
            />
        </View>
    );
}
