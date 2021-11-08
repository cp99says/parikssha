import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    StatusBar,
    ImageBackground,
    Animated,
    Image,
    TouchableOpacity,
} from "react-native";
import {COLORS} from "../Constants/GlobalStyle";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export function SubjectCard(props) {
    const {imageSource, Title, Style, onPress} = props;
    return (
        <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
            <Image style={Style ? Style : styles.imageStyle} source={imageSource} />
            <Text
                style={{
                    alignSelf: "center",
                    paddingTop: "6%",
                    color: COLORS.PURPLE,
                    fontWeight: "bold",
                    paddingBottom: "5%",
                    letterSpacing: 1.5,
                }}
            >
                {Title}
            </Text>
        </TouchableOpacity>
    );
}

export function ExamCard(props) {
    const {imageSource, Title, Style, onPress} = props;
    return (
        <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
            <Image style={Style ? Style : styles.imageStyle} source={imageSource} />
            <Text
                style={{
                    alignSelf: "center",
                    paddingTop: "6%",
                    color: COLORS.PURPLE,
                    fontWeight: "bold",
                    paddingBottom: "5%",
                    letterSpacing: 1.5,
                }}
            >
                {Title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        width: wp(40),
        height: wp(40),
        justifyContent: "center",
        borderRadius: 20,
        backgroundColor: "#f9fbfc",
    },
    imageStyle: {
        height: 50,
        alignSelf: "center",
        width: 50,
        resizeMode: "contain",
    },
    container1: {
        flex: 1,
        justifyContent: "space-between",
        paddingTop: "5%",
        flexDirection: "row",
        alignItems: "center",
    },
    container2: {
        flex: 3,
    },
    container3: {
        flex: 3,
        justifyContent: "center",
        backgroundColor: "pink",
    },
    TextContainer: {
        flex: 1,
        justifyContent: "center",
    },
    buttonRegister: {
        width: wp(80),
        alignSelf: "center",
        paddingVertical: "5%",
        borderRadius: 50,
        backgroundColor: COLORS.ORANGE,
        marginBottom: "7.4%",
    },
    buttonLogin: {
        width: wp(80),
        alignSelf: "center",
        paddingVertical: "5%",
        borderRadius: 50,
        backgroundColor: COLORS.PURPLE_LIGHT,
    },
});
