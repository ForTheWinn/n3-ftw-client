import React from "react";
import { Link, useLocation } from "react-router-dom";
import { SMITH_PATH, SMITH_PATH_NEP11 } from "../../../../../../consts/routes";

const ListTabs = () => {
  const location = useLocation();
  return (
    <nav className="tabs">
      <div className="container">
        <ul>
          <li className={location.pathname === SMITH_PATH ? "is-active" : ""}>
            <Link to={SMITH_PATH}>Token Showcase</Link>
          </li>
          <li
            className={
              location.pathname === SMITH_PATH_NEP11 ? "is-active" : ""
            }
          >
            <Link to={SMITH_PATH_NEP11}>&nbsp; NFT Showcase</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default ListTabs;
