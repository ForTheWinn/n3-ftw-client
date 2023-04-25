import React, { useMemo } from "react";
import { Route } from "react-router-dom";
import { useApp } from "../common/hooks/use-app";

import NoChainSupport from "./pages/ChainRouting/NoChainSupport";
import NoNetworkSupport from "./pages/ChainRouting/NoNetworkSupport";
import { HEADER_ROUTES } from "../consts";

const Routes = () => {
  const { chain, network } = useApp();
  const memoizedRoutes = useMemo(() => {
    return (
      <>
        {HEADER_ROUTES.map((route: any) => {
          const _chain: any = route.chain[chain];
          return (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
              component={() => {
                if (!_chain) return <NoChainSupport chain={chain} />;
                if (!_chain.includes(network))
                  return <NoNetworkSupport chain={chain} network={network} />;
                return <route.component />;
              }}
            />
          );
        })}
      </>
    );
  }, [chain, network]);

  return memoizedRoutes;
};

export default Routes;
