import React, { useMemo } from "react";
import { Route } from "react-router-dom";
import { useApp } from "../common/hooks/use-app";

import NoChainSupport from "./pages/ChainRouting/NoChainSupport";
import NoNetworkSupport from "./pages/ChainRouting/NoNetworkSupport";
import { ROUTE_LIST } from "../consts/routes";

const Routes = () => {
  const { chain, network } = useApp();
  const memoizedRoutes = useMemo(() => {
    return (
      <>
        {ROUTE_LIST.map((route: any) => {
          const _chain: any = route.chain[chain];
          return (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
              component={
                _chain
                  ? _chain.includes(network)
                    ? route.component
                    : () => <NoNetworkSupport chain={chain} network={network} />
                  : () => <NoChainSupport chain={chain} network={network} />
              }
            />
          );
        })}
      </>
    );
  }, [chain, network]);

  return memoizedRoutes;
};

export default Routes;
