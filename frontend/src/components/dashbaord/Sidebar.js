import React, { useState, useEffect } from "react";
import styles from "./Sidebar.module.scss";

import { useLocation, useHistory } from "react-router-dom";

import { BookOpen, CheckSquare, PieChart, Star } from "react-feather";

import logo from "assets/logo.png";

export default function Sidebar() {
  const [currRoute, setCurrRoute] = useState("start");
  const location = useLocation();
  const history = useHistory();

  function routeTo(path) {
    history.push(path);
  }

  useEffect(() => {
    let pathArr = location.pathname.split("/");
    setCurrRoute(pathArr[pathArr.length - 1]);
  }, [location.pathname]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.logo}>
        <img src={logo} alt="" />
      </div>
      <div className={styles.link}>
        <button
          onClick={routeTo.bind(this, "/dashboard/start")}
          className={currRoute === "start" && styles.active}
        >
          <BookOpen /> Start an exam
        </button>
        <button
          onClick={routeTo.bind(this, "/dashboard/prepare")}
          className={currRoute === "prepare" && styles.active}
        >
          <CheckSquare />
          Preparation
        </button>
        <button
          onClick={routeTo.bind(this, "/dashboard/answers")}
          className={currRoute === "answers" && styles.active}
        >
          <Star /> Answer Key
        </button>
      </div>
    </div>
  );
}
