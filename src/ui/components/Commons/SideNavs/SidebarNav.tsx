import React from "react";
import { NavLink } from "react-router-dom";
import { useApp } from "../../../../common/hooks/use-app";
import SocialLinkGroup from "../SocialLinkGroup";
import { HEADER_ROUTES } from "../../../../consts/navRoutes";

const SidebarNav = () => {
  const { chain, network } = useApp();
  const { toggleSidebar } = useApp();
  return (
    <div
      className="has-scroll-hide"
      style={{ paddingBottom: "50px", overflowY: "scroll" }}
    >
      <aside className="menu p-5">
        <p className="menu-label">Menu</p>
        <ul className="menu-list">
          {HEADER_ROUTES.map((route, i) => {
            const _chain = route.chain[chain];
            if (!_chain) return false;
            if (!_chain.includes(network)) return false;
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
                        const _chain = item.chain[chain];
                        if (!_chain) return false;
                        if (!_chain.includes(network)) return false;
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
              rel="noreferrer"
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
    </div>
  );
};

export default SidebarNav;
