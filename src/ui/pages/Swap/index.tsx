import React, { useEffect } from "react";
import { Route } from "react-router-dom";

import PageLayout from "../../components/Commons/PageLayout";
import SwapMain from "./scenes/Swap";
import { SwapContextProvider } from "./scenes/SwapContext";
import { NEO_ROUTES } from "../../../consts";
import AddLiquidity from "./scenes/AddLiquidity";
import RemoveLiquidity from "./scenes/RemoveLiquidity";

const Swap = () => {
  useEffect(() => {
    document.title = "FTW Swap";
  }, []);

  return (
    <div>
      <PageLayout>
        <div className="columns is-centered">
          <div className="column is-half">
            <div
              className="box is-shadowless is-relative"
              style={{ overflow: "hidden" }}
            >
              <Route
                exact={true}
                path={NEO_ROUTES.SWAP_PATH}
                component={() => (
                  <SwapContextProvider type="swap">
                    <SwapMain />
                  </SwapContextProvider>
                )}
              />
              <Route
                path={NEO_ROUTES.SWAP_PATH_LIQUIDITY_ADD}
                component={() => (
                  <SwapContextProvider type="liquidity">
                    <AddLiquidity />
                  </SwapContextProvider>
                )}
              />
              <Route
                path={NEO_ROUTES.SWAP_PATH_LIQUIDITY_REMOVE}
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
