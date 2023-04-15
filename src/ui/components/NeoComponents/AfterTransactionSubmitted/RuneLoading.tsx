import React, { useEffect, useState } from "react";
import _ from "underscore";
const getColors = () => _.range(18).map((i) => Math.floor(Math.random() * 256));
const RuneLoading = () => {
  const [colors, setColors] = useState(getColors());
  const [bg, setBg] = useState("black");
  const [dot1, setDot1] = useState("black");
  const [dot2, setDot2] = useState("black");
  const [dot3, setDot3] = useState("black");
  const [dot4, setDot4] = useState("black");
  const [body, setBody] = useState("black");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><path fill="${bg}" d="M0 0h512v512H0z"/><path fill="${dot4}" d="M293 378h81v-81h-81Zm0 0"/><path fill="${body}" d="M374 142H138v314h85V226h151Zm0 0"/><path fill="${dot3}" d="M436 56h-86v86h86Zm0 0"/><path fill="${dot2}" d="M300 142V56h-87v86Zm0 0"/><path fill="${dot1}" d="M162 142V56H76v86Zm0 0"/></svg>`;
  useEffect(() => {
    let timer = setTimeout(() => {
      setBody("white");
    }, 1000);
    timer = setTimeout(() => {
      setDot1("white");
    }, 2000);
    timer = setTimeout(() => {
      setDot2("white");
    }, 3000);
    timer = setTimeout(() => {
      setDot3("white");
    }, 4000);
    timer = setTimeout(() => {
      setDot4("white");
    }, 5000);
    timer = setTimeout(() => {
      setBg("rgb(" + colors[0] + "," + colors[1] + "," + colors[2] + ")");
    }, 6000);
    timer = setTimeout(() => {
      setBody("rgb(" + colors[3] + "," + colors[4] + "," + colors[5] + ")");
    }, 7000);
    timer = setTimeout(() => {
      setDot1("rgb(" + colors[6] + "," + colors[7] + "," + colors[8] + ")");
    }, 8000);
    timer = setTimeout(() => {
      setDot2("rgb(" + colors[9] + "," + colors[10] + "," + colors[11] + ")");
    }, 9000);
    timer = setTimeout(() => {
      setDot3("rgb(" + colors[12] + "," + colors[13] + "," + colors[14] + ")");
    }, 10000);
    timer = setTimeout(() => {
      setDot4("rgb(" + colors[15] + "," + colors[16] + "," + colors[17] + ")");
    }, 11000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <img width="100%" height="100%" src={`data:image/svg+xml;utf8,${svg}`} />
  );
};

export default RuneLoading;
