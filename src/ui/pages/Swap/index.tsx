import React, { useEffect, useMemo } from "react";
import { Route } from "react-router-dom";

import PageLayout from "../../components/Commons/PageLayout";
import SwapMain from "./scenes/Swap";
import { SwapContextProvider } from "./scenes/SwapContext";
import AddLiquidity from "./scenes/AddLiquidity";
import RemoveLiquidity from "./scenes/RemoveLiquidity";
import {
  SWAP_PATH,
  SWAP_PATH_LIQUIDITY_ADD,
  SWAP_PATH_LIQUIDITY_REMOVE,
} from "../../../consts/routes";
import { useApp } from "../../../common/hooks/use-app";
import { useWalletRouter } from "../../../common/hooks/use-wallet-router";

const Swap = () => {
  useEffect(() => {
    document.title = "FTW Swap";
  }, []);

  const appContext = useApp();
  const walletRouterContext = useWalletRouter(appContext.chain);

  const SwapMainMemoized = useMemo(() => {
    return (
      <SwapContextProvider
        type="swap"
        chain={appContext.chain}
        network={appContext.network}
        refreshCount={appContext.refreshCount}
        userWalletAddress={walletRouterContext.address}
        increaseRefreshCount={appContext.increaseRefreshCount}
      >
        <SwapMain />
      </SwapContextProvider>
    );
  }, [
    appContext.chain,
    appContext.network,
    appContext.refreshCount,
    walletRouterContext.address,
  ]);
  return (
    <div>
      <PageLayout>
        <div className="columns is-centered">
          <div className="column is-5">
            <div
              className=" is-shadowless is-relative"
              style={{ overflow: "hidden" }}
            >
              <Route
                exact={true}
                path={SWAP_PATH}
                render={() => SwapMainMemoized}
              />
              <Route
                path={SWAP_PATH_LIQUIDITY_ADD}
                render={() => (
                  <SwapContextProvider
                    type="liquidity"
                    chain={appContext.chain}
                    network={appContext.network}
                    refreshCount={appContext.refreshCount}
                    userWalletAddress={walletRouterContext.address}
                    increaseRefreshCount={appContext.increaseRefreshCount}
                  >
                    <AddLiquidity />
                  </SwapContextProvider>
                )}
              />
              <Route
                path={SWAP_PATH_LIQUIDITY_REMOVE}
                component={RemoveLiquidity}
              />
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default Swap;
