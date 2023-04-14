import React from "react";
import PageLayout from "../../components/Commons/PageLayout";
import { Route } from "react-router-dom";
import StakingMain from "./scenes/Main";
import Stake from "./scenes/Stake";
import MyPositions from "./scenes/MyPositions";
import CheckMarketStatus from "./components/CheckMarketStatus";
import { useApp } from "../../../common/hooks/use-app";
import { NEO_ROUTES } from "../../../consts";
import ClaimRewards from "./scenes/ClaimRewards";

const Farm = () => {
  const { chain, network } = useApp();

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
                  component={() => (
                    <StakingMain chain={chain} network={network} />
                  )}
                />
                <Route
                  exact={true}
                  path={NEO_ROUTES.FARM_V2_STAKE_PATH}
                  component={() => <Stake chain={chain} network={network} />}
                />
                <Route
                  path={NEO_ROUTES.FARM_V2_STAKE_POSITIONS_PATH}
                  component={() => <MyPositions chain={chain} />}
                />
              </div>
            </div>
            <div className="column is-4">
              <ClaimRewards chain={chain} />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Farm;
