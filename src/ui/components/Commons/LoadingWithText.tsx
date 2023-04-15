import React from 'react'
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = <LoadingOutlined style={{ fontSize: 14 }} spin />;

const LoadingWithText = ({ title }) => {
    return (
        <div
            // style={{ display: "flex", justifyContent: "center" }}
        >
            {title} <Spin indicator={antIcon} />
        </div>
    );
}
export default LoadingWithText