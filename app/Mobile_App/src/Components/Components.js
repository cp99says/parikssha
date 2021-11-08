import React, {useEffect, useRef, useState} from "react";
import {View, ActivityIndicator, TextInput, Text} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {COLORS} from "../Constants/GlobalStyle";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
export function Loader(params) {
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <ActivityIndicator size={"large"} color={COLORS.PURPLE} />
        </View>
    );
}
export function Input(props) {
    const {
        Title,
        placeholder,
        placeholderTextColor,
        onChangeText,
        keyboardType,
        value,
        TitleMargin,
        secureTextEntry,
        defaultValue,
        iconName,
    } = props;
    return (
        <View {...props}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <MaterialIcons name={iconName} size={26} color={COLORS.PURPLE} />
                <Text
                    style={{
                        fontFamily: "Montserrat-Medium",
                        color: COLORS.PURPLE,
                        fontSize: 18,
                        marginLeft: "1%",
                    }}
                >
                    {Title}
                </Text>
            </View>
            <TextInput
                style={{
                    width: wp(90),
                    borderWidth: 1,
                    marginTop: TitleMargin ? TitleMargin : hp(1),
                    borderRadius: 5,
                    paddingLeft: 10,
                    borderColor: COLORS.PURPLE,
                }}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                defaultValue={defaultValue}
                value={value}
                secureTextEntry={secureTextEntry}
            />
        </View>
    );
}
