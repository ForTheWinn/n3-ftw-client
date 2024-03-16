import React, { useMemo } from "react";
import { Route } from "react-router-dom";
import { useApp } from "../common/hooks/use-app";

import NoChainSupport from "./pages/ChainRouting/NoChainSupport";
import NoNetworkSupport from "./pages/ChainRouting/NoNetworkSupport";
import { ROUTE_LIST } from "../consts/routes";
import { Alert } from "antd";
import { NEOX_CHAIN } from "../consts/global";

const Routes = () => {
  const { chain, network } = useApp();
  const memoizedRoutes = useMemo(() => {
    return (
      <>
        {chain === NEOX_CHAIN && (
          <Alert
            className="has-text-centered"
            message="NeoX is still in development. All data will be cleared following the mainnet launch. The purpose of this testnet is to assess the platform's functionality. Please refrain from using real assets."
            banner
            showIcon={false}
          />
        )}

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
