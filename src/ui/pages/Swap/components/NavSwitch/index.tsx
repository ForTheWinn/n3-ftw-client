import React from "react";
import { Link, useLocation } from "react-router-dom";
import { NEO_ROUTES } from "../../../../../consts";

const NavSwitch = () => {
  const location = useLocation();
  return (
    <div className="tabs is-toggle">
      <ul>
        <li
          className={
            location.pathname === NEO_ROUTES.SWAP_PATH
              ? "is-active"
              : "has-background-white"
          }
        >
          <Link to={NEO_ROUTES.SWAP_PATH}>Swap</Link>
        </li>
      </ul>
    </div>
  );
};

export default NavSwitch;
