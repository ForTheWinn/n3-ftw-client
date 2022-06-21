import React, { useState } from "react";
import PageLayout from "../../components/PageLayout";
import { Route } from "react-router-dom";
import {
  FARM_PAGE_ROUTE,
  FARM_PATH,
  FARM_STAKE_PATH,
  FARM_STAKE_POSITIONS_PATH,
} from "../../../consts";
import StakingMain from "./scenes/Main";
import Stake from "./scenes/Stake";
import MyPositions from "./scenes/MyPositions";
import ClaimRewards from "./scenes/ClaimRewards";
import { useWallet } from "../../../packages/provider";
import TestnetOnlyRoute from "../../components/TestnetOnlyRoute";
import CheckMarketStatus from "./components/CheckMarketStatus";

const Farm = () => {
  const { network } = useWallet();
  const [refresh, setRefresh] = useState(0);
  if (!FARM_PAGE_ROUTE.network.includes(network)) {
    return <TestnetOnlyRoute title={"FTW Farm"} />;
  }
  return (
    <PageLayout>
      <div className="columns">
        <div className="column is-6 is-offset-3">
          <div className="columns">
            <div className="column is-9">
	            <CheckMarketStatus />
              <div className="box is-shadowless">
                <Route exact={true} path={FARM_PATH} component={StakingMain} />
                <Route
                  exact={true}
                  path={FARM_STAKE_PATH}
                  component={() => (
                    <Stake onRefresh={() => setRefresh(refresh + 1)} />
                  )}
                />
                <Route
                  path={FARM_STAKE_POSITIONS_PATH}
                  component={() => (
                    <MyPositions onRefresh={() => setRefresh(refresh + 1)} />
                  )}
                />
              </div>
            </div>
            <div className="column is-4">
              <div className="box">
                <ClaimRewards pRefresh={refresh} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Farm;
