import React from "react";
interface ILevelProps {
  isMobile?: boolean;
  left?: any;
  right?: any;
}
const Level = ({ isMobile, left, right }: ILevelProps) => {
  return (
    <>
      <div className="columns is-centered">
        <div className="column">{left}</div>
        <div className="column is-narrow">{right}</div>
      </div>
    </>
  );
};

export default Level;
