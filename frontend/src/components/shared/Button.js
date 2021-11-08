import React from "react";
import styles from "./Button.module.scss";

export default function Button({ name, width, backgroundColor, textColor, onClick, type, form }) {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      type={type}
      form={form}
      style={{ width: width, backgroundColor: backgroundColor, color: textColor }}
    >
      {name}
    </button>
  );
}
