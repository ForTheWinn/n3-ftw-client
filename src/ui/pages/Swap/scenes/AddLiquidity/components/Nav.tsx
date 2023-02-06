import React from "react";
import { FaAngleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import SettingDropdown from "./SettingDropdown";

interface INavProps {
  title: string;
  path: any;
  slippage: number;
  setSlippage: (val) => void;
}
const Nav = ({ title, path, slippage, setSlippage }: INavProps) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
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
          <SettingDropdown slippage={slippage} setSlippage={setSlippage} />
        </div>
      </div>
    </div>
  );
};

export default Nav;
