import React, { useState } from "react";
import styles from "./StartExam.module.scss";

import { useHistory } from "react-router-dom";

import Button from "components/shared/Button";
import { colors } from "components/shared/colors";
import exam from "assets/exam.png";

export default function StartExam() {
  const [formdata, setFormdata] = useState("");
  const history = useHistory();

  function handleFormChange(e) {
    setFormdata(e.target.value);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    history.push(`/dashboard/exam/${formdata}`);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.vector}>
        <img src={exam} alt="" />
      </div>
      <div className={styles.form}>
        <form onChange={handleFormChange} onSubmit={handleFormSubmit}>
          <label>Enter exam code</label>
          <input type="text" />
          <Button name="START EXAM" backgroundColor={colors.PRIMARY} />
        </form>
      </div>
    </div>
  );
}
