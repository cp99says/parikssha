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
    ScrollView,
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

export default function RegisterScreen() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function Register() {
        if (email == "" || username == "" || password == "") {
            showNotification("Please,fill the form properly");
            return;
        } else {
            setLoading(true);
            try {
                const data = await API_CALL(
                    {
                        url: `/api/teacher/register?username=${username}&email=${email}&password=${password}`,
                        method: "post",
                    },
                    {type: "WEB"}
                );
                // console.log("data.data", data.data)
                console.log(data);
                if (data.status == "success") {
                    setLoading(false);
                    let authState = "true";
                    showNotification("Registered Successfully");

                    storeData("authState", authState);
                    storeData("teacherId", data.teacher_id);
                    storeData("userName", data.username);

                    Store.setTeacherIdVal(data.teacher_id);
                    Store.setUsernameVal(data.username);
                    Store.setAuthTokenVal(1);
                }
            } catch (error) {
                showNotification("Error Occurred");
                console.log(error);
            }
        }
    }
    return loading ? (
        <>
            <FocusAwareStatusBar backgroundColor={COLORS.HEADER_GREY} />
            <Loader />
        </>
    ) : (
        <ScrollView
            style={styles.mainContainer}
            contentContainerStyle={{
                paddingTop: "1.2%",
                paddingBottom: "8%",
                backgroundColor: COLORS.WHITE,
            }}
            keyboardShouldPersistTaps={"handled"}
        >
            <FocusAwareStatusBar backgroundColor={COLORS.HEADER_GREY} />
            <View style={styles.container1}>
                <Image
                    source={require("../../Assets/Images/logo.png")}
                    style={{
                        width: wp(80),
                        height: hp(10),
                        marginTop: 50,
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
                    Title="Username"
                    placeholder="Set a username"
                    style={{marginTop: hp(2)}}
                    iconName={"account-box"}
                    defaultValue={username}
                    onChangeText={txt => {
                        setUsername(txt);
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
                        marginTop: wp(15),
                    }}
                    onPress={() => {
                        Register();
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
                        Register
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
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
        marginBottom: 20,
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
