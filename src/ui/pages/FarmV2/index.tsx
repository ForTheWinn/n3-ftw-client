import React, { useEffect, useState } from "react";
import PageLayout from "../../components/Commons/PageLayout";
import { Route, useHistory, useRouteMatch } from "react-router-dom";
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
import { useApp } from "../../../common/hooks/use-app";
import { useOnChainData } from "../../../common/hooks/use-onchain-data";
import { getPrices } from "./services";
import { NEO_CHAIN, POLYGON_CHAIN } from "../../../packages/chains/consts";
import { POLYGON_FARM_PATH } from "../../../consts/polygonRoutes";

interface IFarmProps {
  path?: string;
}

const Farm = (props: IFarmProps) => {
  const { chain } = useApp();
  const [refresh, setRefresh] = useState(0);
  const { data } = useOnChainData(() => getPrices(chain), [refresh]);

  let { path } = useRouteMatch();
  let history = useHistory();

  if (props.path) {
    path = props.path;
  }

  if (path !== FARM_V2_PATH && chain === NEO_CHAIN) {
    history.push(FARM_V2_PATH);
  }

  if (path !== POLYGON_FARM_PATH && chain === POLYGON_CHAIN) {
    history.push(POLYGON_FARM_PATH);
  }
  
  if (!data) return <></>;

  console.log(path)

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
                  path={path}
                  component={() => <StakingMain prices={data} chain={chain} />}
                />
                <Route
                  exact={true}
                  path={`${path}${FARM_V2_STAKE_PATH}`}
                  component={() => (
                    <Stake onRefresh={() => setRefresh(refresh + 1)} />
                  )}
                />
                <Route
                  path={`${path}${FARM_V2_STAKE_POSITIONS_PATH}`}
                  component={() => (
                    <MyPositions onRefresh={() => setRefresh(refresh + 1)} />
                  )}
                />
              </div>
            </div>
            <div className="column is-4">
              <ClaimRewards prices={data} />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Farm;
