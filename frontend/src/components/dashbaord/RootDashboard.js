import React from "react";
import styles from "./RootDashboard.module.scss";

import Sidebar from "./Sidebar";
import { ChevronDown } from "react-feather";
import DashboardRouter from "./DashboardRouter";

export default function RootDashboard() {
  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.controller}>
        <div>A</div>
        Atimabh Barunaha
        <ChevronDown />
      </div>
      <DashboardRouter />
    </div>
  );
}
