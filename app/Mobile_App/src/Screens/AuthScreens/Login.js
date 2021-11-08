import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Platform,
    TouchableWithoutFeedback,
    StyleSheet,
    Dimensions,
    FlatList,
    Button,
    TextInput,
    StatusBar,
    Image,
} from "react-native";
import {COLORS} from "../../Constants/GlobalStyle";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {API_CALL} from "../../Functions/ApiFunctions";
import {Input, Loader} from "../../Components/Components";
import {FocusAwareStatusBar, showNotification, storeData} from "../../Functions/AppFunctions";
import Store from "../../Store/Store";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function Login() {
        if (email == "" || password == "") {
            showNotification("Please,fill the form properly");
            return;
        } else {
            setLoading(true);
            try {
                const data = await API_CALL(
                    {
                        url: `/api/teacher/login?email=${email}&password=${password}`,
                        method: "post",
                    },
                    {type: "WEB"}
                );
                console.log("data.data", data);
                // console.log(data);
                if (data.status == "success") {
                    setLoading(false);
                    let authState = "true";
                    showNotification("Logged In Successfully");

                    storeData("authState", authState);
                    storeData("teacherId", data.decoded_values.teacher_id);
                    storeData("userName", data.decoded_values.username);

                    Store.setTeacherIdVal(data.decoded_values.teacher_id);
                    Store.setUsernameVal(data.decoded_values.username);
                    Store.setAuthTokenVal(1);
                }
            } catch (error) {
                showNotification("Error Occurred");
                console.log(error);
                setLoading(false);
            }
        }
    }
    return loading ? (
        <>
            <FocusAwareStatusBar backgroundColor={COLORS.HEADER_GREY} />
            <Loader />
        </>
    ) : (
        <View style={styles.mainContainer}>
            <FocusAwareStatusBar backgroundColor={COLORS.HEADER_GREY} />
            <View style={styles.container1}>
                <Image
                    source={require("../../Assets/Images/logo.png")}
                    style={{
                        width: wp(80),
                        height: hp(10),
                        resizeMode: "contain",
                    }}
                />
            </View>
            <View style={styles.container2}>
                <Input
                    Title="Email"
                    placeholder="Enter your Email"
                    style={{marginTop: hp(3)}}
                    iconName={"email"}
                    defaultValue={email}
                    onChangeText={txt => {
                        setEmail(txt);
                    }}
                />
                <Input
                    Title="Password"
                    placeholder="Enter your Password"
                    style={{marginTop: hp(2)}}
                    secureTextEntry={true}
                    iconName={"lock"}
                    defaultValue={password}
                    onChangeText={txt => {
                        setPassword(txt);
                    }}
                />
            </View>
            <View style={styles.container3}>
                <TouchableOpacity
                    style={{
                        alignSelf: "center",
                        width: wp(60),
                        backgroundColor: COLORS.PURPLE,
                        borderRadius: 8,
                        justifyContent: "center",
                        paddingVertical: "3.4%",
                        marginTop: wp(10),
                    }}
                    onPress={() => {
                        Login();
                    }}
                >
                    <Text
                        style={{
                            alignSelf: "center",
                            fontSize: 18,
                            fontFamily: "Montserrat-SemiBold",
                            color: COLORS.WHITE,
                        }}
                    >
                        Login
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: "1.2%",
        backgroundColor: COLORS.WHITE,
        // paddingBottom: "5%",
    },
    card: {
        width: wp(95),
        elevation: 5,
        backgroundColor: COLORS.WHITE,
        marginVertical: "2%",
        alignSelf: "center",
        borderRadius: 5,
        padding: 15,
    },
    container1: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container2: {
        flex: 1.5,

        alignItems: "center",
    },
    container3: {
        flex: 1,
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
