import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = <LoadingOutlined style={{ fontSize: 14 }} spin />;

const LoadingWithText = ({ title }) => {
  return (
    <>
      {title} <Spin indicator={antIcon} />
    </>
  );
};
export default LoadingWithText;
