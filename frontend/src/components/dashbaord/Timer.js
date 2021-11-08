import React from "react";
import { Clock } from "react-feather";
import { useTimer } from "react-timer-hook";

export default function Timer({ expiryTimestamp }) {
  const { seconds, minutes, hours, isRunning } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called"),
  });

  return (
    <>
      <Clock /> {hours} : {minutes} : {seconds}
    </>
  );
}
