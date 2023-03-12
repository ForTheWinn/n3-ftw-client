import React from "react";
interface ILevelProps {
  isMobile?: boolean;
  left?: any;
  right?: any;
}
const Level = ({ isMobile, left, right }: ILevelProps) => {
  return (
    <div className={`level ${isMobile ? "is-mobile" : ""}`}>
      <div className="level-left">
        <div className="level-item">{left}</div>
      </div>
      <div className="level-right">
        <div className="level-item">{right}</div>
      </div>
    </div>
  );
};

export default Level;
