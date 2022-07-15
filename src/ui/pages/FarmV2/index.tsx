import React, { useEffect, useState } from "react";
import PageLayout from "../../components/PageLayout";
import { Route } from "react-router-dom";
import {
  FARM_V2_PATH,
  FARM_V2_STAKE_PATH,
  FARM_V2_STAKE_POSITIONS_PATH,
} from "../../../consts";
import StakingMain from "./scenes/Main";
import Stake from "./scenes/Stake";
import MyPositions from "./scenes/MyPositions";
import ClaimRewards from "./scenes/ClaimRewards";
import CheckMarketStatus from "./components/CheckMarketStatus";

const Farm = () => {
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    document.title = "FTW | Double Farm";
  }, []);
  return (
    <PageLayout>
      <div className="columns">
        <div className="column is-8 is-offset-2">
          <div className="columns">
            <div className="column is-8">
              <CheckMarketStatus />
              <div className="box is-shadowless">
                <Route
                  exact={true}
                  path={FARM_V2_PATH}
                  component={StakingMain}
                />
                <Route
                  exact={true}
                  path={FARM_V2_STAKE_PATH}
                  component={() => (
                    <Stake onRefresh={() => setRefresh(refresh + 1)} />
                  )}
                />
                <Route
                  path={FARM_V2_STAKE_POSITIONS_PATH}
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
