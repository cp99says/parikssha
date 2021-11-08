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
} from "react-native";
import {COLORS} from "../../Constants/GlobalStyle";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {API_CALL} from "../../Functions/ApiFunctions";
import Modal from "react-native-modal";
import Icon, {Icons} from "../../Components/Icons";
import {FocusAwareStatusBar, showNotification} from "../../Functions/AppFunctions";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

function ExamPreview({route}) {
    const [editable, setEditable] = useState(false);
    const [questionData, setQuestionData] = useState("");
    const [questionId, setQuestionId] = useState("");
    const [answerId, setAnswerId] = useState("");

    const [editedQuestion, setEditedQuestion] = useState("");
    const [editedAnswer, setEditedAnswer] = useState("");

    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const {data} = route.params;
    const renderItemFunc = ({item, index}) => (
        <View style={styles.card}>
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Text
                    style={{
                        fontFamily: "Montserrat-SemiBold",
                        color: "#3D2A40",
                        fontSize: 16,
                        flex: 1,
                    }}
                >
                    Q{index + 1}.<Text> {item.question}</Text>
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        toggleModal();
                        let data = {
                            question: item.question,
                            answer: item.answer,
                        };
                        setEditedQuestion(item.question);
                        setEditedAnswer(item.answer);
                        setQuestionData(data);
                        setQuestionId(item.question_id);
                        setAnswerId(item.answer_key_id);
                    }}
                    style={{alignSelf: "flex-start", paddingTop: "0.54%"}}
                >
                    <Icon type={Icons.MaterialIcons} name={"edit"} color={"#4D3159"} size={25} />
                </TouchableOpacity>
            </View>

            <View style={{flex: 1, marginTop: "2%"}}>
                <Text
                    style={{
                        fontFamily: "Montserrat-Medium",
                        color: COLORS.ANS_TEXT_COLOR,
                        fontSize: 14,
                    }}
                >
                    A. {item.answer}
                </Text>
            </View>
        </View>
    );
    function SubmitEditing(params) {
        if (editedQuestion == "") {
            return showNotification("Question Cannot be empty");
        }
        if (editedAnswer == "") {
            return showNotification("Answer Cannot be empty");
        }
        data.questions.map(data => {
            if (data.question_id == questionId) {
                data.question = editedQuestion;
            }
            if (data.answer_key_id == answerId) {
                data.answer = editedAnswer;
            }
        });
        toggleModal();
    }
    async function editQuestionPaper() {
        const exam_code = data.exam_code;
        const payload = data;

        try {
            const data = await API_CALL(
                {
                    url: `/api/teacher/exam/${exam_code}`,
                    method: "patch",
                    data: payload,
                },
                {type: "ML"}
            );
            // console.log("data.data", data.data)
            if (data.status) {
                showNotification("Exam details updated");
            } else {
                showNotification("Error occurred");
            }
        } catch (error) {
            console.log(error);
        }
    }
    async function toogleExamActivation() {
        const exam_code = data.exam_code;
        const payload = data;
        payload.exam_started = !payload.exam_started;

        console.log("val", payload.exam_started);
        try {
            const data = await API_CALL(
                {
                    url: `/api/teacher/exam/${exam_code}`,
                    method: "patch",
                    data: payload,
                },
                {type: "ML"}
            );
            // console.log("data.data", data.data)
            if (data.status) {
                if (payload.exam_started) {
                    showNotification("Exam activated successfully");
                } else {
                    showNotification("Exam deactivated ");
                }
            } else {
                showNotification("Error occurred");
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <FocusAwareStatusBar backgroundColor={COLORS.HEADER_GREY} />
            <View style={{flex: 0.1, backgroundColor: COLORS.WHITE, justifyContent: "center"}}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-around",
                    }}
                >
                    <TouchableOpacity
                        style={{
                            paddingVertical: 8,
                            paddingHorizontal: 4,
                            borderRadius: 6,
                            justifyContent: "center",
                            width: wp(44),
                            borderColor: COLORS.PURPLE,
                            borderWidth: 1,
                        }}
                        onPress={() => {
                            editQuestionPaper();
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Montserrat-Medium",
                                color: COLORS.PURPLE,
                                fontSize: 14,
                                alignSelf: "center",
                            }}
                        >
                            Save Changes
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            paddingVertical: 9.2,
                            paddingHorizontal: 6,
                            borderRadius: 6,
                            justifyContent: "center",
                            width: wp(40),
                            backgroundColor: COLORS.PURPLE,
                        }}
                        onPress={() => {
                            toogleExamActivation();
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: "Montserrat-Medium",
                                color: COLORS.WHITE,
                                fontSize: 14,
                                alignSelf: "center",
                            }}
                        >
                            {!data.exam_started ? "Activate Exam" : "Deactivate Exam"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.mainContainer}>
                {isModalVisible ? <StatusBar backgroundColor={COLORS.PURPLE_LIGHT} /> : null}

                <FlatList
                    contentContainerStyle={{paddingBottom: 120}}
                    data={data.questions}
                    renderItem={renderItemFunc}
                    keyExtractor={item => item.question_id}
                />

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
                            height: hp(55),
                        }}
                    >
                        <View style={{flex: 1}}>
                            <Text
                                style={{
                                    fontFamily: "Montserrat-Medium",
                                    color: COLORS.PURPLE,
                                    fontSize: 18,
                                    marginLeft: "1%",
                                }}
                            >
                                Question
                            </Text>
                            <TextInput
                                style={{
                                    width: wp(80),
                                    borderWidth: 1,
                                    flex: 1,
                                    borderRadius: 5,
                                    borderColor: COLORS.PURPLE_LIGHT,
                                    marginTop: "2.5%",
                                    alignSelf: "center",
                                    paddingLeft: "2.5%",
                                }}
                                multiline
                                textAlignVertical={"top"}
                                defaultValue={questionData.question}
                                onChangeText={txt => {
                                    setEditedQuestion(txt);
                                }}
                            />
                        </View>
                        <View style={{flex: 1}}>
                            <Text
                                style={{
                                    fontFamily: "Montserrat-Medium",
                                    color: COLORS.PURPLE,
                                    fontSize: 18,
                                    marginLeft: "1%",
                                    marginTop: "4%",
                                }}
                            >
                                Answer
                            </Text>
                            <TextInput
                                style={{
                                    width: wp(80),
                                    borderWidth: 1,
                                    flex: 1,
                                    borderRadius: 5,
                                    borderColor: COLORS.PURPLE_LIGHT,
                                    marginTop: "2.5%",
                                    alignSelf: "center",
                                    paddingLeft: "2.5%",
                                }}
                                multiline
                                textAlignVertical={"top"}
                                defaultValue={questionData.answer}
                                onChangeText={txt => {
                                    setEditedAnswer(txt);
                                }}
                            />
                        </View>
                        <View style={{flex: 1 / 2, justifyContent: "center"}}>
                            <TouchableOpacity
                                style={{
                                    alignSelf: "center",
                                    width: wp(40),
                                    backgroundColor: COLORS.PURPLE,
                                    borderRadius: 8,
                                    justifyContent: "center",
                                    paddingVertical: "3.4%",
                                    marginTop: "4.8%",
                                }}
                                onPress={() => {
                                    SubmitEditing();
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
                    </View>
                </Modal>
            </View>
        </>
    );
}

export default ExamPreview;
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: "1.2%",
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
        justifyContent: "space-between",
        paddingTop: "5%",
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
