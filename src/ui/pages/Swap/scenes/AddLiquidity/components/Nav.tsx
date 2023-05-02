import React from "react";
import { FaAngleLeft, FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";

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
        alignItems: "center"
      }}
    >
      <div style={{ width: "50px" }}>
        <Link className="button is-white is-small" to={path}>
          <span className="icon">
            <FaAngleLeft />
          </span>
          <span className="is-hidden-mobile">Main</span>
        </Link>
      </div>

      <h1 className="title is-5 is-marginless has-text-centered">{title}</h1>

      <div className="is-relative" style={{ width: "50px" }}>
        <div className="is-pulled-right">
          <button onClick={onSettingClick} className="button is-white is-small">
            <FaCog />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Nav;
