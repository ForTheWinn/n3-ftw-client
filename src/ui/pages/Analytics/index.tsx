import React from "react";
import { Route, Switch } from "react-router-dom";
import AnalyticsMain from "./scenes/Main";
import PairDetail from "./scenes/PairDetail";
import TokenDetail from "./scenes/TokenDetail";
import PageLayout from "../../components/Commons/PageLayout";
import { NEO_ROUTES } from "../../../consts";

const Analytics = (props) => {
  return (
    <div>
      <Switch>
        <Route
          exact={true}
          path={NEO_ROUTES.ANALYTICS_PATH}
          component={AnalyticsMain}
        />
        <Route
          exact={true}
          path={`${NEO_ROUTES.ANALYTICS_PAIRS_PATH}/:pairId`}
          component={(props) => {
            return <PairDetail id={props.match.params.pairId} />;
          }}
        />
        <Route
          exact={true}
          path={`${NEO_ROUTES.ANALYTICS_TOKENS_PATH}/:tokenId`}
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
