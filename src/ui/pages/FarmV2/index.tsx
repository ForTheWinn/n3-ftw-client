import React from "react";
import PageLayout from "../../components/Commons/PageLayout";
import { Route } from "react-router-dom";
import StakingMain from "./scenes/Main";
import Stake from "./scenes/Stake";
import MyPositions from "./scenes/MyPositions";
import ClaimRewards from "./scenes/ClaimRewards";
import CheckMarketStatus from "./components/CheckMarketStatus";
import { useApp } from "../../../common/hooks/use-app";
import { useOnChainData } from "../../../common/hooks/use-onchain-data";
import { NEO_CHAIN, POLYGON_CHAIN } from "../../../consts/chains";
import { NEP_SCRIPT_HASH } from "../../../packages/neo/consts/neo-contracts";
import { farmRouter } from "../../../common/routers";
import { NEO_ROUTES } from "../../../consts";

const Farm = () => {
  const { chain, refreshCount } = useApp();
  const { network } = useApp();

  let nepPrice = undefined;

  const { data } = useOnChainData(
    () => farmRouter.getPrices(chain),
    [refreshCount]
  );

  if (!data) return <></>;

  if (chain === NEO_CHAIN) {
    nepPrice = data[NEP_SCRIPT_HASH[network]];
  }

  if (chain === POLYGON_CHAIN) {
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
                  path={NEO_ROUTES.FARM_V2_PATH}
                  component={() => (
                    <StakingMain
                      prices={data}
                      chain={chain}
                      nepPrice={nepPrice}
                    />
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
              <ClaimRewards chain={chain} prices={data} />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Farm;
