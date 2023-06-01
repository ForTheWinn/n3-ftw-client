import React, { useEffect } from "react";
import PageLayout from "../../components/Commons/PageLayout";
import { Route } from "react-router-dom";
import { BRIDGE_PATH, BRIDGE_TRANSFERS_PATH } from "../../../consts/neoRoutes";
import BridgeSwap from "./scene/BridgeMain";
import { SwapContextProvider } from "./scene/BridgeMain/context";
import BridgeHistory from "./scene/BridgeHistory";

const Bridge = () => {
  useEffect(() => {
    document.title = "FTW Bridge";
  }, []);
  return (
    <PageLayout>
      <div className="columns is-centered">
        <div className="column is-half">
          <Route
            exact={true}
            path={BRIDGE_PATH}
            component={() => (
              <SwapContextProvider>
                <BridgeSwap />
              </SwapContextProvider>
            )}
          />
          <Route
            path={BRIDGE_TRANSFERS_PATH + "/:chainId"}
            component={BridgeHistory}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default Bridge;
