import React from "react";
import { CHAINS, CONFIGS } from "../../../consts/chains";
import PageLayout from "../../components/Commons/PageLayout";
import { Avatar, Card } from "antd";
import { HOME_PATH } from "../../../consts/neoRoutes";
import { Link } from "react-router-dom";
import { INetworkType } from "../../../packages/neo/network";

interface IChainRoutingProps {
  chain: CHAINS;
  network: INetworkType;
}
const NoChainSupport = ({ chain, network }: IChainRoutingProps) => {
  const config = CONFIGS[network][chain];
  return (
    <PageLayout>
      <Card>
        <div className="media">
          <div className="media-left">
            <Avatar src={config.icon} />
          </div>
          <div className="media-content">
            This page doesn't support on <strong>{config.label}</strong>.
            <br />
            <br />
            <Link className={`button is-${config.color}`} to={HOME_PATH}>
              Home
            </Link>
          </div>
        </div>
      </Card>
    </PageLayout>
  );
};

export default NoChainSupport;
