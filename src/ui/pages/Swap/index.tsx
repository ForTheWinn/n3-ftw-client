import React, { useEffect } from "react";
import { Route, useRouteMatch } from "react-router-dom";

import {
  SWAP_PATH_LIQUIDITY_ADD,
  SWAP_PATH_LIQUIDITY_REMOVE,
} from "../../../consts";

import PageLayout from "../../components/Commons/PageLayout";
import Liquidity from "./scenes/AddLiquidity";
import Trade from "./scenes/Swap";
import RemoveLiquidity from "./scenes/RemoveLiquidity";
// import MarketStatus from "./components/CheckMarketStatus";

interface ISwapProps {
  path?: string;
}

const Swap = (props: ISwapProps) => {
  useEffect(() => {
    document.title = "FTW Swap";
  }, []);
  let { path } = useRouteMatch();
  if (props.path) {
    path = props.path;
  }

  console.log(path);
  return (
    <div>
      <PageLayout>
        <div className="columns is-centered">
          <div className="column is-half">
            {/* <MarketStatus /> */}
            <div className="box is-shadowless">
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
