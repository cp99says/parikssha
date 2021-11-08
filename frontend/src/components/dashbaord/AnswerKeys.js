import Button from "components/shared/Button";
import styles from "./AnswerKeys.module.scss";
import { colors } from "components/shared/colors";
import React, { useState } from "react";

import answers from "assets/answers.png";
import { getRequest } from "utils/requests";
import Modal from "components/shared/Modal";
import Preloader from "components/shared/Preloader";

export default function AnswerKeys() {
  const [examid, setExamid] = useState(null);
  const [ans, setAns] = useState(null);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  function toggle() {
    setModal((prev) => !prev);
  }

  function handleFormChange(e) {
    setExamid(e.target.value);
  }
  function handleFormSubmit(e) {
    e.preventDefault();
    setLoading(true);
    getRequest(`/api/students/answerkey/${examid}`)
      .then((resp) => {
        console.log(resp);
        setAns(resp.data.questions);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
        toggle();
      });
  }
  return loading ? (
    <Preloader />
  ) : (
    <div className={styles.wrapper}>
      <div className={styles.vector}>
        <img src={answers} alt="" />
      </div>
      <div className={styles.form}>
        <form onChange={handleFormChange} onSubmit={handleFormSubmit}>
          <label>Enter exam code</label>
          <input type="text" />
          <Button name="View Answer Key" backgroundColor={colors.PRIMARY} />
        </form>
      </div>

      <Modal isOpen={modal} onClose={toggle} title="Answer Key">
        <div className={styles.answerKeyContainer}>
          {ans &&
            ans.map((item, index) => (
              <div>
                <p>
                  <span>Q{index + 1})</span> {item.question}
                </p>
                <p>
                  <span>Ans)</span> {item.answer}
                </p>
              </div>
            ))}
        </div>
      </Modal>
    </div>
  );
}
