import React, { useEffect } from "react";
import PageLayout from "../../components/Commons/PageLayout";
import MarketStatus from "../Swap/components/CheckMarketStatus";
import { Route } from "react-router-dom";
import { BRIDGE_PATH } from "../../../consts";
import BridgeMain from "./scene/Main";

const Bridge = () => {
  useEffect(() => {
    document.title = "FTW Bridge";
  }, []);
  return (
    <div>
      <PageLayout>
        <div className="columns is-centered">
          <div className="column is-half">
            <MarketStatus />
            <div className="box is-shadowless">
              <Route exact={true} path={BRIDGE_PATH} component={BridgeMain} />
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default Bridge;
