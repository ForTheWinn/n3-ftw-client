import React from "react";
import PageLayout from "../../components/Commons/PageLayout";
import { Route } from "react-router-dom";
import StakingMain from "./scenes/Main";
import Stake from "./scenes/Stake";
import MyPositions from "./scenes/MyPositions";
import CheckMarketStatus from "./components/CheckMarketStatus";
import { NEO_ROUTES } from "../../../consts";
import ClaimRewards from "./scenes/ClaimRewards";

const Farm = () => {

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
                  path={NEO_ROUTES.FARM_V2_PATH}
                  component={StakingMain}
                />
                <Route
                  exact={true}
                  path={NEO_ROUTES.FARM_V2_STAKE_PATH}
                  component={Stake}
                />
                <Route
                  path={NEO_ROUTES.FARM_V2_STAKE_POSITIONS_PATH}
                  component={MyPositions}
                />
              </div>
            </div>
            <div className="column is-4">
              <ClaimRewards />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Farm;
