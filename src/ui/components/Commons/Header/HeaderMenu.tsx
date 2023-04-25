import React from "react";
import { NavLink } from "react-router-dom";
import { CHAINS } from "../../../../consts/chains";
import { INetworkType } from "../../../../packages/neo/network";
import { HEADER_ROUTES } from "../../../../consts/navRoutes";
interface IHeaderMenuProps {
  chain: CHAINS;
  network: INetworkType;
}
export const HeaderMenu = ({ chain, network }: IHeaderMenuProps) => {
  return (
    <>
      {HEADER_ROUTES.map((route: any, i) => {
        const _chain = route.chain[chain];
        if (!_chain) return false;
        if (!_chain.includes(network)) return false;
        if (route.noShow) return false;
        if (route.category.length > 0) {
          return (
            <div
              key={`header-${route.label}${i}`}
              className="navbar-item has-dropdown is-hoverable"
            >
              <NavLink className="navbar-link" to={route.path}>
                {route.label}
              </NavLink>
              <div className="navbar-dropdown">
                {route.category.map((item, index) => {
                  const _chain = item.chain[chain];
                  if (!_chain) return false;
                  if (!_chain.includes(network)) return false;
                   if (item.noShow) return false;
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
