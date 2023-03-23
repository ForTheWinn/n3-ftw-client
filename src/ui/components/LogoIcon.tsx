import React from "react";
import { Avatar } from "antd";
interface ILogoIconProps {
  img: string;
  width?: string;
  height?: string;
}
const LogoIcon = ({ img, width, height }: ILogoIconProps) => {
  return (
    <>
      <Avatar src={img} />
      {/* <div
        style={{
          position: "relative",
          borderRadius: "50%",
          background: "white",
          width: width ? width : "30px",
          height: height ? height : "30px",
          justifyContent: "center",
          display: "flex",
          // margin: "auto",
        }}
      >
        <img style={{ width: "100%" }} src={img} />
      </div> */}
    </>
  );
};

export default LogoIcon;
