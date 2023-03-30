import React, { useEffect } from "react";
import { Route, useHistory, useRouteMatch } from "react-router-dom";

import {
  SWAP_PATH,
  SWAP_PATH_LIQUIDITY_ADD,
  SWAP_PATH_LIQUIDITY_REMOVE
} from "../../../consts";

import PageLayout from "../../components/Commons/PageLayout";
import Liquidity from "./scenes/AddLiquidity";
import Trade from "./scenes/Swap";
import RemoveLiquidity from "./scenes/RemoveLiquidity";
import { NEO_CHAIN, POLYGON_CHAIN } from "../../../consts/chains";
import { useApp } from "../../../common/hooks/use-app";
import { POLYGON_SWAP_PATH } from "../../../consts/polygonRoutes";
// import MarketStatus from "./components/CheckMarketStatus";

interface ISwapProps {
  path?: string;
}

const Swap = (props: ISwapProps) => {
  // useEffect(() => {
  //   document.title = "FTW Swap";
  // }, []);

  let { path } = useRouteMatch();
  let history = useHistory();
  const { chain, switchChain } = useApp();

  if (props.path) {
    path = props.path;
  }

  if (path !== SWAP_PATH && chain === NEO_CHAIN) {
    history.push(SWAP_PATH);
  }

  if (path !== POLYGON_SWAP_PATH && chain === POLYGON_CHAIN) {
    history.push(POLYGON_SWAP_PATH);
  }

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
                path={path}
                component={() => <Trade rootPath={path} />}
              />
              <Route
                path={path + SWAP_PATH_LIQUIDITY_ADD}
                component={() => <Liquidity rootPath={path} />}
              />
              <Route
                path={path + SWAP_PATH_LIQUIDITY_REMOVE}
                component={() => <RemoveLiquidity rootPath={path} />}
              />
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default Swap;
