import React from "react";
import { NavLink } from "react-router-dom";
import { navRoutes } from "../../../../consts/navRoutes";
import { CHAINS } from "../../../../packages/chains/consts";
import { INetworkType } from "../../../../packages/neo/network";
interface IHeaderMenuProps {
  chain: CHAINS;
  network: INetworkType;
}
export const HeaderMenu = ({ chain, network }: IHeaderMenuProps) => {
  return (
    <>
      {navRoutes[chain].map((route, i) => {
        if (!route.network.includes(network)) return false;
        if (route.category.length > 0) {
          return (
            <div
              key={`header-${route.label}${i}`}
              className="navbar-item has-dropdown is-hoverable"
            >
              <div className="navbar-link">{route.label}</div>
              <div className="navbar-dropdown is-boxed">
                {route.category.map((item, index) => {
                  return (
                    <NavLink
                      key={`category-${item.label}-${item.label}${index}`}
                      activeClassName="is-active"
                      to={item.path}
                      className="navbar-item"
                    >
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        } else {
          return (
            <NavLink
              key={`header-${route.label}${i}`}
              activeClassName="is-active"
              to={route.path}
              className="navbar-item"
            >
              {route.label}
            </NavLink>
          );
        }
      })}
    </>
  );
};
