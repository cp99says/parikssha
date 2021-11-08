import React from "react";
import styles from "./Navbar.module.scss";

import logo from "assets/logo.png";

import Button from "components/shared/Button";
import { colors } from "components/shared/colors";

export default function Navbar() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.maxWidthContainer}>
        <div className={styles.logo}>
          <img src={logo} alt="" />
        </div>
        <div className={styles.links}>
          <p>Home</p>
          <p>About</p>
          <p>Team</p>
        </div>
      </div>
    </div>
  );
}
