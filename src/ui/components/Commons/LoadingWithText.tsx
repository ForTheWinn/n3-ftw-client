import React from "react";
import { Space, Spin, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = <LoadingOutlined style={{ fontSize: 14 }} spin />;

const LoadingWithText = ({ title }) => {
  return (
    <Space>
      <Typography.Text>{title}</Typography.Text>
      <Spin indicator={antIcon} />
    </Space>
  );
};
export default LoadingWithText;
