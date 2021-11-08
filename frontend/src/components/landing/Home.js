import React from "react";
import styles from "./Home.module.scss";
import { useHistory } from "react-router-dom";
import heroImg from "assets/hero.png";

import Navbar from "components/landing/Navbar";
import Button from "components/shared/Button";

import { colors } from "components/shared/colors";

export default function Home() {
  const history = useHistory();
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div className={styles.heroText}>
        <p>Redefining your exam experience</p>
        <div className={styles.controllers}>
          <Button
            onClick={() => {
              history.push("/dashboard/start");
            }}
            name="Get Started"
            backgroundColor={colors.GREEN}
            width="150px"
          />
          <Button name="Learn More" backgroundColor={colors.GREEN} width="150px" />
        </div>
      </div>
      <div className={styles.features}>
        <div className={styles.feature}></div>
        <div className={styles.feature}></div>
        <div className={styles.feature}></div>
      </div>
      <div className={styles.heroImageContainer}>
        <div className={styles.controllers}>
          <button className={styles.login}>Login</button>
          <Button
            name="Sign Up"
            width="150px"
            backgroundColor={colors.PRIMARY}
            textColor={colors.PEACH}
          />
        </div>
        <img src={heroImg} alt="" />
      </div>
    </div>
  );
}
