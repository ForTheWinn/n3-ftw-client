import React from "react";
import { NavLink } from "react-router-dom";
import { CHAINS } from "../../../../consts/chains";
import { HEADER_ROUTES } from "../../../../consts";
import { INetworkType } from "../../../../packages/neo/network";
interface IHeaderMenuProps {
  chain: CHAINS;
  network: INetworkType;
}
export const HeaderMenu = ({ chain, network }: IHeaderMenuProps) => {
  return (
    <>
      {HEADER_ROUTES.map((route, i) => {
        const _chain = route.chain[chain];
        if (!_chain) return false;
        if (!_chain.includes(network)) return false;
        if (route.category.length > 0) {
          return (
            <div
              key={`header-${route.label}${i}`}
              className="navbar-item has-dropdown is-hoverable"
            >
              <div className="navbar-link">{route.label}</div>
              <div className="navbar-dropdown is-boxed">
                {route.category.map((item, index) => {
                   const _chain = item.chain[chain];
                   if (!_chain) return false;
                   if (!_chain.includes(network)) return false;
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
