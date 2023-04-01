import React, { useState } from "react";
import PageLayout from "../../components/Commons/PageLayout";
import { Route, useHistory, useRouteMatch } from "react-router-dom";
import StakingMain from "./scenes/Main";
import Stake from "./scenes/Stake";
import MyPositions from "./scenes/MyPositions";
import ClaimRewards from "./scenes/ClaimRewards";
import CheckMarketStatus from "./components/CheckMarketStatus";
import { useApp } from "../../../common/hooks/use-app";
import { useOnChainData } from "../../../common/hooks/use-onchain-data";
import { NEO_CHAIN, POLYGON_CHAIN } from "../../../consts/chains";
import { NEP_SCRIPT_HASH } from "../../../packages/neo/consts/neo-contracts";
import { useWallet } from "../../../packages/neo/provider";
import { farmRouter } from "../../../common/routers";
import { NEO_ROUTES, POLYGON_ROUTES } from "../../../consts";

interface IFarmProps {
  path?: string;
}

const Farm = (props: IFarmProps) => {
  const { chain, refreshCount } = useApp();
  const { network } = useWallet();

  let nepPrice = undefined;

  const { data } = useOnChainData(
    () => farmRouter.getPrices(chain),
    [refreshCount]
  );

  let { path } = useRouteMatch();
  let history = useHistory();

  if (props.path) {
    path = props.path;
  }

  if (!data) return <></>;

  if (chain === NEO_CHAIN) {
    if (path !== NEO_ROUTES.FARM_V2_PATH) {
      history.push(NEO_ROUTES.FARM_V2_PATH);
    }
    nepPrice = data[NEP_SCRIPT_HASH[network]];
  }

  if (chain === POLYGON_CHAIN) {
    if (path !== POLYGON_ROUTES.FARM_PATH) {
      history.push(POLYGON_ROUTES.FARM_PATH);
    }
    //TODO::change later
    nepPrice = data[NEP_SCRIPT_HASH[network]];
  }

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
                  component={() => (
                    <StakingMain
                      path={path}
                      prices={data}
                      chain={chain}
                      nepPrice={nepPrice}
                    />
                  )}
                />
                <Route
                  exact={true}
                  path={`${path}${NEO_ROUTES.FARM_V2_STAKE_PATH}`}
                  component={() => (
                    <Stake path={path} chain={chain} network={network} />
                  )}
                />
                <Route
                  path={`${path}${NEO_ROUTES.FARM_V2_STAKE_POSITIONS_PATH}`}
                  component={() => <MyPositions chain={chain} path={path} />}
                />
              </div>
            </div>
            <div className="column is-4">
              <ClaimRewards chain={chain} path={path} prices={data} />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Farm;
