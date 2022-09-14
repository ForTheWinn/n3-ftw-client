import React from "react";
import { NavLink } from "react-router-dom";
import { useApp } from "../../common/hooks/use-app";
import { MENU } from "../../consts";
import { useWallet } from "../../packages/provider";
import SocialLinkGroup from "./SocialLinkGroup";

const SidebarNav = (props) => {
  const { network } = useWallet();
  const { toggleSidebar } = useApp();
  return (
    <div
      className="has-scroll-hide"
      style={{ paddingBottom: "50px", overflowY: "scroll" }}
    >
      <aside className="menu p-5">
        <p className="menu-label">Menu</p>
        <ul className="menu-list">
          {MENU.map((route, i) => {
            if (!route.network.includes(network)) return false;
            return (
              <li key={`${route.label}${i}`}>
                {route.category.length > 0 ? (
                  <>
                    <NavLink
                      onClick={toggleSidebar}
                      key={`category-${route.label}`}
                      // activeClassName={"is-active"}
                      to={route.path}
                    >
                      {route.label}
                    </NavLink>
                    <ul>
                      {route.category.map((item) => {
                        return (
                          <li key={item.label}>
                            <NavLink
                              onClick={toggleSidebar}
                              key={`category-${item.label}`}
                              activeClassName={"is-active"}
                              to={item.path}
                            >
                              {item.label}
                            </NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                ) : (
                  <NavLink
                    onClick={toggleSidebar}
                    activeClassName={"is-active"}
                    to={route.path}
                  >
                    {route.label}
                  </NavLink>
                )}
              </li>
            );
          })}
          <li>
            {" "}
            <a
              target={"_blank"}
              className="navbar-item"
              href={"http://docs.forthewin.network/"}
            >
              Documentation
            </a>
          </li>
          <li>
            <hr style={{ backgroundColor: "transparent" }} />
            <div className="buttons">
              <SocialLinkGroup />
            </div>
          </li>
        </ul>
      </aside>
      {/*<div*/}
      {/*  className="p-5 is-hidden-mobile"*/}
      {/*  style={{ position: "absolute", bottom: "40px" }}*/}
      {/*>*/}
      {/*  <div className="buttons">*/}
      {/*    <SocialLinkGroup />*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
};

export default SidebarNav;
