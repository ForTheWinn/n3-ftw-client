import React from "react";
import { Route, Switch } from "react-router-dom";
import AnalyticsMain from "./scenes/Main";
import PairDetail from "./scenes/PairDetail";
import TokenDetail from "./scenes/TokenDetail";
import PageLayout from "../../components/Commons/PageLayout";
import {
  ANALYTICS_PAIRS_PATH,
  ANALYTICS_PATH,
  ANALYTICS_TOKENS_PATH
} from "../../../consts/routes";

const Analytics = () => {
  return (
    <div>
      <Switch>
        <Route exact={true} path={ANALYTICS_PATH} component={AnalyticsMain} />
        <Route
          exact={true}
          path={`${ANALYTICS_PAIRS_PATH}/:pairId`}
          component={(props) => {
            return <PairDetail id={props.match.params.pairId} />;
          }}
        />
        <Route
          exact={true}
          path={`${ANALYTICS_TOKENS_PATH}/:tokenId`}
          component={(props) => {
            return (
              <PageLayout>
                <TokenDetail tokenId={props.match.params.tokenId} />
              </PageLayout>
            );
          }}
        />
      </Switch>
    </div>
  );
};

export default Analytics;
