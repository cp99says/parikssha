import React, { useState, useEffect, useRef } from "react";
import styles from "./Exam.module.scss";

import { useParams, useHistory } from "react-router-dom";

import { Clock } from "react-feather";
import Webcam from "react-webcam";
import Button from "components/shared/Button";

import { colors } from "components/shared/colors";
import { getRequest, putRequest } from "utils/requests";
import Timer from "./Timer";
import Preloader from "components/shared/Preloader";
import Modal from "components/shared/Modal";

export default function Exam() {
  const [examData, setExamData] = useState(null);
  const [questionIterator, setQuestionIterator] = useState(0);
  const [responses, setResponses] = useState([]);
  const [showResponse, setShowResponse] = useState(null);
  const [tempResponse, setTempResponse] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const responseRef = useRef();
  const params = useParams();
  const history = useHistory();

  const time = new Date();
  time.setSeconds(time.getSeconds() + 3600);

  function toggleConfirmationModal() {
    setIsModal((prev) => !prev);
  }

  function changeQues(action) {
    console.log(questionIterator);
    console.log(responses[questionIterator]);
    responseRef.current.reset();
    switch (action) {
      case "prev":
        // if (responses[questionIterator]) {
        //   setShowResponse(responses[questionIterator].response);
        // }
        if (questionIterator === 0) {
          return;
        } else {
          setQuestionIterator((prev) => {
            if (prev === 0) {
              setShowResponse(responses[prev].response);
            } else {
              setShowResponse(responses[prev - 1].response);
            }
            return prev - 1;
          });
        }
        break;
      case "next":
        setQuestionIterator((prev) => prev + 1);
        break;
      default:
        return 0;
    }
  }

  function getExamData() {
    getRequest(`/api/students/examination/${params.examId.toLowerCase()}`)
      .then((resp) => {
        console.log(resp);
        setExamData(resp.data);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleResponseChange(e) {
    setTempResponse(e.target.value);
  }

  function handleResponseSubmit(e) {
    e.preventDefault();
    const updateResponses = [...responses];
    const checkIndex = updateResponses.findIndex(
      (resp) => resp.questionID === examData.questions[questionIterator].question_id
    );
    if (checkIndex === -1) {
      updateResponses.push({
        QuestionID: examData.questions[questionIterator].question_id,
        response: tempResponse,
      });
    } else {
      updateResponses[checkIndex] = {
        QuestionID: examData.questions[questionIterator].question_id,
        response: tempResponse,
      };
    }
    console.log(updateResponses);
    let payload = {
      student_username: "cp99says",
      answers: updateResponses,
    };
    putRequest(`/api/students/response/${params.examId.toLowerCase()}`, payload)
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => console.log(err));
    setResponses(updateResponses);
  }

  function submitExam() {
    setIsLoading(true);
    const updateResponses = [...responses];
    const checkIndex = updateResponses.findIndex(
      (resp) => resp.questionID === examData.questions[questionIterator].question_id
    );
    if (checkIndex === -1) {
      updateResponses.push({
        QuestionID: examData.questions[questionIterator].question_id,
        response: tempResponse,
      });
    } else {
      updateResponses[checkIndex] = {
        QuestionID: examData.questions[questionIterator].question_id,
        response: tempResponse,
      };
    }
    console.log(updateResponses);
    let payload = {
      student_username: "cp99says",
      answers: updateResponses,
    };
    putRequest(`/api/students/response/${params.examId.toLowerCase()}`, payload)
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
        history.push("/dashboard/start");
      });
  }

  useEffect(() => {
    getExamData();
  }, []);

  return examData && !isLoading ? (
    <div className={styles.wrapper}>
      <div className={styles.globalTimer}>
        <Timer expiryTimestamp={time} />
      </div>
      <div className={styles.examContainer}>
        <div className={styles.exam}>
          <div className={styles.questionContainer}>
            <p>
              Q{questionIterator + 1}) {examData.questions[questionIterator].question}
            </p>
          </div>
          <div className={styles.answerInput}>
            <form
              ref={responseRef}
              id="response"
              onChange={handleResponseChange}
              onSubmit={handleResponseSubmit}
            >
              <textarea
                name="answer"
                defaultValue={showResponse ? showResponse : null}
                placeholder="Type your answer here..."
              ></textarea>
            </form>
          </div>
          <div className={styles.controllers}>
            <div className={styles.navigators}>
              {/* <Button
                  name="PREV"
                  onClick={changeQues.bind(this, "prev")}
                  backgroundColor={colors.GREEN}
                  width="100px"
                /> */}
              {examData.questions.length - questionIterator === 1 ? null : (
                <Button
                  name="NEXT"
                  type="submit"
                  form="response"
                  onClick={changeQues.bind(this, "next")}
                  backgroundColor={colors.GREEN}
                  width="100px"
                />
              )}
            </div>
            <Button
              onClick={toggleConfirmationModal}
              name="END EXAM"
              backgroundColor={colors.ORANGE}
              width="150px"
            />
          </div>
        </div>
        <div className={styles.monitoring}>
          <div className={styles.camera}>
            <Webcam mirrored />
          </div>
        </div>
      </div>
      <Modal isOpen={isModal} title="Submit Exam?" onClose={toggleConfirmationModal}>
        <div className={styles.submitModal}>
          <p>Are you sure you want to submit your exam?</p>
          <div className={styles.controllers}>
            <Button
              onClick={toggleConfirmationModal}
              name="No"
              backgroundColor={colors.GREEN}
              width="150px"
            />
            <Button onClick={submitExam} name="Yes" backgroundColor={colors.ORANGE} width="150px" />
          </div>
        </div>
      </Modal>
    </div>
  ) : (
    <Preloader />
  );
}
