import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { SettingOutlined, LeftOutlined } from "@ant-design/icons";
interface INavProps {
  title: string;
  path: any;
  onSettingClick: () => void;
}
const Nav = ({ title, path, onSettingClick }: INavProps) => {
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
        <Link to={path}>
          <Button size="small" icon={<LeftOutlined />} type="text">
            Main
          </Button>
        </Link>
      </div>

      <h1 className="title is-5 is-marginless has-text-centered">{title}</h1>

      <div className="is-relative" style={{ width: "80px" }}>
        <div className="is-pulled-right">
          <Button onClick={onSettingClick} type="text" size="small">
            <SettingOutlined />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Nav;
