import React from "react";

interface IInputDividerProps {
  onClick?: () => void;
  icon: any;
}
const InputDivider = ({ onClick, icon }: IInputDividerProps) => {
  return (
    <div
      style={{
        width: "40px",
        height: "40px",
        position: "relative",
        margin: "-18px auto",
        zIndex: 2
      }}
    >
      <button
        style={{
          width: "40px",
          height: "40px"
        }}
        onClick={onClick}
        className={`button is-small is-light is-rounded ${
          onClick ? "" : "is-active"
        }`}
      >
        {icon}
      </button>
    </div>
  );
};

export default InputDivider;
