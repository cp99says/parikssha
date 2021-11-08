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
    Dimensions,
    TouchableWithoutFeedback,
    TouchableOpacity,
    PermissionsAndroid,
} from "react-native";
import {COLORS} from "../../Constants/GlobalStyle";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Modal from "react-native-modal";
import {ExamCard, SubjectCard} from "../../Components/HomeScreenComponents";
import ImagePicker from "react-native-image-crop-picker";
import DocumentPicker from "react-native-document-picker";
import {
    FocusAwareStatusBar,
    localNotification,
    showNotification,
} from "../../Functions/AppFunctions";
import {API_CALL} from "../../Functions/ApiFunctions";
import {Loader} from "../../Components/Components";
import Store from "../../Store/Store";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

const HomeScreen = ({navigation}) => {
    const [fadeAnimation, setFadeAnimation] = useState(new Animated.Value(0));
    const [fadeAnimationImage, setFadeAnimationImage] = useState(new Animated.Value(0));
    const [isModalVisible, setModalVisible] = useState(false);
    const [questionCount, setquestionCount] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [topicName, setTopicName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const requestCameraPermission = async () => {
        let status = false;
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Cool Photo App Camera Permission",
                    message:
                        "Cool Photo App needs access to your camera " +
                        "so you can take awesome pictures.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK",
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // console.log("You can use the camera");
                status = true;
            } else {
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
        return status;
    };
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

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    async function OpenCamera() {
        const status = await requestCameraPermission();
        if (status) {
            ImagePicker.openCamera({
                width: 800,
                height: 600,
                cropping: true,
                freeStyleCropEnabled: true,
            })
                .then(image => {
                    setLoading(true);
                    // console.log(image.path);
                    let filename = image.path.substring(image.path.lastIndexOf("/") + 1);

                    UploadFile(image.path, filename);
                })
                .catch(error => {
                    setLoading(false);
                    showNotification("Cancelled");
                });
        } else {
            showNotification("Camera permission denied");
        }
    }
    async function OpenFilePicker() {
        try {
            const res = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.images],
            });
            if (res.uri) {
                setLoading(true);

                UploadFile(res.uri, res.name);
            }
        } catch (err) {
            setLoading(false);
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }
    async function UploadFile(file, fileName) {
        let formData = new FormData();
        formData.append("file", {
            name: fileName,
            type: "image/jpeg",
            uri: file,
        });
        try {
            const data = await API_CALL(
                {
                    url: `/upload/file`,
                    method: "post",
                    data: formData,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
                {type: "WEB"}
            );
            // console.log("data.data", data.data)
            console.log(data);
            if (data.file_upload_status == "success") {
                setImageUrl(data.file_url);
                setLoading(false);

                toggleModal();
            } else {
                showNotification("error occurred");
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }
    async function SubmitForm() {
        console.log(questionCount, topicName, subjectName);
        if (questionCount == "" || topicName == "" || subjectName == "") {
            showNotification("Fill form properly");
            return;
        }
        if (imageUrl == "") {
            showNotification("File Upload Error");
            return;
        } else {
            toggleModal();
            showNotification("New exam status will be notified soon");
            try {
                const data = await API_CALL(
                    {
                        url: `/api/teacher/initexam/${Store.teacherIdVal}`,
                        method: "post",
                        data: {
                            blob_url: imageUrl,
                            question_count: questionCount,
                            subject: subjectName,
                            topic_name: topicName,
                        },
                    },
                    {type: "ML"}
                );
                // console.log("data.data", data.data)
                console.log(data);

                if (data.status == "201") {
                    let message = `Exam created successfully : ${data.exam_code}`;
                    localNotification(message);
                } else {
                    let message = `Error occurred, Please try again`;
                    localNotification(message);
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
        <View style={styles.mainContainer}>
            <FocusAwareStatusBar backgroundColor={COLORS.WHITE} />
            <ImageBackground
                source={require("../../Assets/Images/HomeScreen_BG.png")}
                style={{flex: 1}}
            >
                {isModalVisible ? <StatusBar backgroundColor={COLORS.PURPLE_LIGHT} /> : null}

                <Modal
                    isVisible={isModalVisible}
                    deviceWidth={deviceWidth}
                    deviceHeight={deviceHeight}
                    useNativeDriver={true}
                    useNativeDriverForBackdrop={true}
                    hideModalContentWhileAnimating={true}
                    animationType={"fadeIn"}
                    onRequestClose={() => {
                        toggleModal();
                    }}
                    onBackdropPress={() => setModalVisible(false)}
                    customBackdrop={
                        <TouchableWithoutFeedback onPress={toggleModal}>
                            <View style={{flex: 1, backgroundColor: COLORS.PURPLE_LIGHT}} />
                        </TouchableWithoutFeedback>
                    }
                >
                    <View
                        style={{
                            width: wp(90),
                            backgroundColor: COLORS.WHITE,
                            borderRadius: 6,
                            padding: 15,
                            height: hp(56),
                            paddingTop: 24,
                        }}
                    >
                        <View>
                            <Text
                                style={{
                                    fontFamily: "Montserrat-Bold",
                                    color: COLORS.PURPLE,
                                    fontSize: 18,
                                    alignSelf: "center",
                                    marginBottom: "7.4%",
                                }}
                            >
                                EXAM DETAILS
                            </Text>
                        </View>
                        <Text
                            style={{
                                fontFamily: "Montserrat-Medium",
                                color: COLORS.PURPLE,
                                fontSize: 18,
                                marginLeft: "1%",
                            }}
                        >
                            Question Count
                        </Text>
                        <TextInput
                            style={{
                                width: wp(80),
                                borderWidth: 1,

                                borderRadius: 5,
                                borderColor: COLORS.PURPLE_LIGHT,
                                marginTop: "2.5%",
                                alignSelf: "center",
                                paddingLeft: "2.5%",
                            }}
                            keyboardType={"decimal-pad"}
                            multiline
                            textAlignVertical={"center"}
                            onChangeText={txt => {
                                setquestionCount(txt);
                            }}
                        />

                        <Text
                            style={{
                                fontFamily: "Montserrat-Medium",
                                color: COLORS.PURPLE,
                                fontSize: 18,
                                marginLeft: "1%",
                                marginTop: "4%",
                            }}
                        >
                            Subject Name
                        </Text>
                        <TextInput
                            style={{
                                width: wp(80),
                                borderWidth: 1,

                                borderRadius: 5,
                                borderColor: COLORS.PURPLE_LIGHT,
                                marginTop: "2.5%",
                                alignSelf: "center",
                                paddingLeft: "2.5%",
                            }}
                            multiline
                            textAlignVertical={"center"}
                            onChangeText={txt => {
                                setSubjectName(txt);
                            }}
                        />

                        <Text
                            style={{
                                fontFamily: "Montserrat-Medium",
                                color: COLORS.PURPLE,
                                fontSize: 18,
                                marginLeft: "1%",
                                marginTop: "4%",
                            }}
                        >
                            Topic Name
                        </Text>
                        <TextInput
                            style={{
                                width: wp(80),
                                borderWidth: 1,

                                borderRadius: 5,
                                borderColor: COLORS.PURPLE_LIGHT,
                                marginTop: "2.5%",
                                alignSelf: "center",
                                paddingLeft: "2.5%",
                            }}
                            multiline
                            textAlignVertical={"center"}
                            onChangeText={txt => {
                                setTopicName(txt);
                            }}
                        />

                        <TouchableOpacity
                            style={{
                                alignSelf: "center",
                                width: wp(40),
                                backgroundColor: COLORS.PURPLE,
                                borderRadius: 8,
                                justifyContent: "center",
                                paddingVertical: "3.4%",
                                marginTop: "10.8%",
                            }}
                            onPress={() => {
                                SubmitForm();
                            }}
                        >
                            <Text
                                style={{
                                    alignSelf: "center",

                                    fontFamily: "Montserrat-SemiBold",
                                    color: COLORS.WHITE,
                                }}
                            >
                                Submit
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                <View style={styles.container1}>
                    <Image
                        source={{uri: "https://picsum.photos/id/1011/200"}}
                        style={{height: 50, width: 50, borderRadius: 50 / 2, marginLeft: "5%"}}
                    />
                    <MaterialCommunityIcons
                        name={"bell-outline"}
                        size={32}
                        style={{marginRight: "6%"}}
                        color={COLORS.PURPLE}
                    />
                </View>
                <View style={{marginLeft: "5%"}}>
                    <Text style={{fontSize: hp(4), color: COLORS.PURPLE}}>
                        Hello,{"\n"}
                        <Text style={{fontSize: hp(4), color: COLORS.PURPLE, fontWeight: "bold"}}>
                            {Store.usernameVal} 😀
                        </Text>
                    </Text>
                </View>
                <View style={styles.container2}>
                    <View style={{marginLeft: "5%"}}>
                        <Text
                            style={{
                                fontSize: hp(2.8),
                                color: COLORS.PURPLE,
                                fontWeight: "bold",
                                marginBottom: "5%",
                            }}
                        >
                            Subjects
                        </Text>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-evenly"}}>
                        <SubjectCard
                            imageSource={require("../../Assets/Images/chem.png")}
                            Title={"Chemistry"}
                            onPress={() => {
                                navigation.navigate("SubjectScreen", {data: "Chemistry"});
                            }}
                            Style={{
                                height: 50,
                                alignSelf: "center",
                                width: 50,
                                resizeMode: "contain",
                            }}
                        />
                        <SubjectCard
                            onPress={() => {
                                navigation.navigate("SubjectScreen", {data: "Physics"});
                            }}
                            imageSource={require("../../Assets/Images/physics1.png")}
                            Title={"Physics"}
                        />
                    </View>
                </View>
                <View style={styles.container3}>
                    <View style={{marginLeft: "5%"}}>
                        <Text
                            style={{
                                fontSize: hp(2.8),
                                color: COLORS.PURPLE,
                                fontWeight: "bold",
                                marginBottom: "5%",
                            }}
                        >
                            Exam
                        </Text>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-evenly"}}>
                        <ExamCard
                            imageSource={require("../../Assets/Images/camera.png")}
                            Title={"Capture"}
                            onPress={OpenCamera}
                        />
                        <ExamCard
                            imageSource={require("../../Assets/Images/file-upload.png")}
                            Style={{
                                height: 50,
                                alignSelf: "center",
                                width: 50,
                                resizeMode: "contain",
                            }}
                            Title={"Upload"}
                            onPress={OpenFilePicker}
                        />
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    container1: {
        flex: 1,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
    },
    container2: {
        flex: 3,
        marginTop: "-5%",
        justifyContent: "center",
    },
    container3: {
        flex: 3,
        marginTop: "-10%",
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
export default HomeScreen;
