import React, { useEffect, useState } from "react";
import _ from "underscore";
const getColors = () => _.range(18).map((i) => Math.floor(Math.random() * 256));

interface IDisplayRandomRuneProps {
  width: string;
  height: string;
  isActive?: boolean;
}
const DisplayRandomRune = ({
  width,
  height,
  isActive,
}: IDisplayRandomRuneProps) => {
  const [colors, setColors] = useState(getColors());
  const bg = "rgb(" + colors[0] + "," + colors[6] + "," + colors[12] + ")";
  const dot1 = "rgb(" + colors[1] + "," + colors[7] + "," + colors[13] + ")";
  const dot2 = "rgb(" + colors[2] + "," + colors[8] + "," + colors[14] + ")";
  const dot3 = "rgb(" + colors[3] + "," + colors[9] + "," + colors[15] + ")";
  const dot4 = "rgb(" + colors[4] + "," + colors[10] + "," + colors[16] + ")";
  const body = "rgb(" + colors[5] + "," + colors[11] + "," + colors[17] + ")";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><path fill="${bg}" d="M0 0h512v512H0z"/><path fill="${dot4}" d="M293 378h81v-81h-81Zm0 0"/><path fill="${body}" d="M374 142H138v314h85V226h151Zm0 0"/><path fill="${dot3}" d="M436 56h-86v86h86Zm0 0"/><path fill="${dot2}" d="M300 142V56h-87v86Zm0 0"/><path fill="${dot1}" d="M162 142V56H76v86Zm0 0"/></svg>`;
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setColors(getColors());
      }, 2000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <img style={{ width, height }} src={`data:image/svg+xml;utf8,${svg}`} />
  );
};

export default DisplayRandomRune;
