import React from "react";
import styles from "./Preloader.module.scss";

import ClipLoader from "react-spinners/BeatLoader";

export default function Preloader() {
  return (
    <div className={styles.wrapper}>
      <ClipLoader color={"#6a2c70"} size={10} />
    </div>
  );
}
