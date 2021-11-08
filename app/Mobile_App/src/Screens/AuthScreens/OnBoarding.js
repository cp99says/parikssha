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
import {COLORS} from "../../Constants/GlobalStyle";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const OnBoarding = ({navigation}) => {
    const [fadeAnimation, setFadeAnimation] = useState(new Animated.Value(0));
    const [fadeAnimationImage, setFadeAnimationImage] = useState(new Animated.Value(0));

    useEffect(() => {
        fadeIn();
    }, []);
    const fadeIn = () => {
        Animated.timing(fadeAnimation, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
        }).start();
        Animated.timing(fadeAnimationImage, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={styles.mainContainer}>
            <StatusBar translucent backgroundColor="transparent" />
            <ImageBackground
                source={require("../../Assets/Images/OnBoarding_BG.png")}
                style={{flex: 1}}
            >
                <View style={styles.container1}></View>
                <Animated.View
                    style={[
                        styles.container2,
                        {
                            opacity: fadeAnimation,
                        },
                    ]}
                >
                    <View style={styles.TextContainer}>
                        <Animated.Image
                            source={require("../../Assets/Images/Pariksha_Logo_White.png")}
                            style={{
                                height: 55,
                                width: wp(75),
                                marginTop: "-18.8%",
                                resizeMode: "contain",
                                alignSelf: "center",
                                opacity: fadeAnimationImage,
                            }}
                        />
                    </View>
                    <View style={styles.container2}>
                        <TouchableOpacity
                            style={styles.buttonRegister}
                            onPress={() => {
                                navigation.navigate("RegisterScreen");
                            }}
                        >
                            <Text style={{textAlign: "center", color: COLORS.WHITE}}>
                                Get Started
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonLogin}
                            onPress={() => {
                                navigation.navigate("LoginScreen");
                            }}
                        >
                            <Text style={{textAlign: "center", color: COLORS.WHITE}}>Log In</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ImageBackground>
        </View>
    );
};
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    container1: {
        flex: 0.7,
    },
    container2: {
        flex: 1,
        justifyContent: "center",
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
export default OnBoarding;
