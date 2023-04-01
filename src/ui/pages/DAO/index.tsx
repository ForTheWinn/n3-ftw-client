import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import ChannelList from "./scenes/ChannelList";
import Channel from "./scenes/Channel";
import CreateChannel from "./scenes/CreateChannel";
import { useWallet } from "../../../packages/neo/provider";
import { NEO_ROUTES } from "../../../consts";

const Dao = () => {
  useEffect(() => {
    document.title = "FTW DAO";
  }, []);
  const { network } = useWallet();
  // if (!DAO_PAGE_ROUTE.network.includes(network as any)) {
  //   return <ProductNotSupportedInNetwork title={"DAO"} network={network} />;
  // }
  return (
    <div>
      <Route exact={true} path={NEO_ROUTES.DAO_PATH} component={ChannelList} />
      <Route
        exact={true}
        path={NEO_ROUTES.DAO_CHANNEL_CREATE_PATH}
        component={CreateChannel}
      />
      <Route
        path={`${NEO_ROUTES.DAO_CHANNEL_PATH}/:contractHash`}
        component={Channel}
      />
    </div>
  );
};

export default Dao;
