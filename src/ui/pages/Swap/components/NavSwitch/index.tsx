import React from "react";
import { Link, useLocation } from "react-router-dom";
import { SWAP_PATH } from "../../../../../consts/routes";

const NavSwitch = () => {
  const location = useLocation();
  return (
    <div className="tabs is-toggle">
      <ul>
        <li
          className={
            location.pathname === SWAP_PATH
              ? "is-active"
              : "has-background-white"
          }
        >
          <Link to={SWAP_PATH}>Swap</Link>
        </li>
      </ul>
    </div>
  );
};

export default NavSwitch;
