import React from "react";
import moment from "moment";

const CountdownRender = ({ timestamp }: { timestamp: number }) => {
  const releaseAt = moment.unix(timestamp / 1000);
  console.log(releaseAt.format("llll"));
  const diff = releaseAt.diff(moment(), "days");
  let timeLeft;
  if (diff > 0) {
    timeLeft = `${diff} day${diff > 1 ? "s" : ""}`;
  } else {
    const diff1 = releaseAt.diff(moment(), "hours");
    if (diff1 > 0) {
      timeLeft = `${diff1} hour${diff1 > 1 ? "s" : ""}`;
    } else {
      const diff2 = releaseAt.diff(moment(), "minutes");
      if (diff2 > 0) {
        timeLeft = `${diff2} min${diff2 > 1 ? "s" : ""}`;
      } else {
        const diff3 = releaseAt.diff(moment(), "seconds");
        if (diff3 > 0) {
          timeLeft = `${diff3} sec`;
        } else {
          timeLeft = "0";
        }
      }
    }
  }
  return timeLeft !== "0" ? <span className="help">{`Next spin in: ${timeLeft}`}</span> : "";
};

export default CountdownRender;
