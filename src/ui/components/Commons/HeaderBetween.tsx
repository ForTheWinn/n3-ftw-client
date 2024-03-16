import React from "react";
import { Link } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
interface IHeaderBetweenProps {
  path: string | object;
  title: string;
  isLoading?: boolean;
}
const HeaderBetween = (props: IHeaderBetweenProps) => {
  return (
    <div
      className="box is-shadowless mb-1"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ width: "80px" }}>
        <Link to={props.path}>
          <Button size="small" icon={<LeftOutlined />} type="text">
            Main
          </Button>
        </Link>
      </div>

      <h1 className="title is-5 is-marginless has-text-centered">
        {props.title}
      </h1>

      <div className="is-relative" style={{ width: "80px" }}>
        {props.isLoading && (
          <div
            className="button is-white is-loading"
            style={{ position: "absolute", right: 0 }}
          />
        )}
      </div>
    </div>
  );
};

export default HeaderBetween;
