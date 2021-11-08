import React from "react";

import { Switch, Route } from "react-router-dom";
import AnswerKeys from "./AnswerKeys";
import Exam from "./Exam";
import Prepare from "./Prepare";
import StartExam from "./StartExam";

export default function DashboardRouter() {
  return (
    <Switch>
      <Route exact path="/dashboard/start" component={StartExam} />
      <Route exact path="/dashboard/prepare" component={Prepare} />
      <Route exact path="/dashboard/answers" component={AnswerKeys} />
      <Route exact path="/dashboard/exam/:examId" component={Exam} />
    </Switch>
  );
}
