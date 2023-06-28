import React, { useEffect } from "react";
import { Route } from "react-router-dom";

import PageLayout from "../../components/Commons/PageLayout";
import SwapMain from "./scenes/Swap";
import { SwapContextProvider } from "./scenes/SwapContext";
import AddLiquidity from "./scenes/AddLiquidity";
import RemoveLiquidity from "./scenes/RemoveLiquidity";
import {
  SWAP_PATH,
  SWAP_PATH_LIQUIDITY_ADD,
  SWAP_PATH_LIQUIDITY_REMOVE
} from "../../../consts/routes";

const Swap = () => {
  useEffect(() => {
    document.title = "FTW Swap";
  }, []);

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
                component={() => (
                  <SwapContextProvider type="swap">
                    <SwapMain />
                  </SwapContextProvider>
                )}
              />
              <Route
                path={SWAP_PATH_LIQUIDITY_ADD}
                component={() => (
                  <SwapContextProvider type="liquidity">
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
