import React from "react";
interface ILevelProps {
  isMobile?: boolean;
  left?: any;
  right?: any;
  className?: string;
}
const Level = ({ isMobile, left, right, className }: ILevelProps) => {
  return (
    <div className={className ? className : ""}>
      <div
        className={`columns is-centered ${isMobile && "is-mobile"}`}
        style={{ alignItems: "center" }}
      >
        <div className="column">{left}</div>
        <div className="column is-narrow">{right}</div>
      </div>
    </div>
  );
};

export default Level;
