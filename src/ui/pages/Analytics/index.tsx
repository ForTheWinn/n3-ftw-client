import React from "react";
import PoolAnalytics from "./Pools";
import {
  ANALYTICS_FARM_PATH,
  ANALYTICS_POOLS_PATH,
  ANALYTICS_ROUTE,
  ANALYTICS_TOKENS_PATH,
} from "../../../consts";
import { Route } from "react-router-dom";
import FarmAnalytics from "./Farm";
import { useWallet } from "../../../packages/provider";
import PageLayout from "../../components/PageLayout";
import TokensAnalytics from "./Tokens";

const Analytics = (props) => {
  const { network } = useWallet();
  if (!ANALYTICS_ROUTE.network.includes(network)) {
    return <PageLayout>Mainnet only</PageLayout>;
  }
  return (
    <div>
      <Route component={TokensAnalytics} path={ANALYTICS_TOKENS_PATH} />
      <Route component={PoolAnalytics} path={ANALYTICS_POOLS_PATH} />
      <Route component={FarmAnalytics} path={ANALYTICS_FARM_PATH} />
    </div>
  );
};

export default Analytics;