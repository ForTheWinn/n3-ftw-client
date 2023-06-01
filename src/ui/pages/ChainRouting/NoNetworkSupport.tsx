import React from "react";
import { INetworkType } from "../../../packages/neo/network";
import PageLayout from "../../components/Commons/PageLayout";
import { CHAINS, CONFIGS } from "../../../consts/chains";
import { Avatar, Card } from "antd";
import { Link } from "react-router-dom";
import { HOME_PATH } from "../../../consts/neoRoutes";
import { MAINNET } from "../../../consts/global";

interface IChainRoutingProps {
  network: INetworkType;
  chain: CHAINS;
}
const NoNetworkSupport = ({ chain, network }: IChainRoutingProps) => {
  const config = CONFIGS[network][chain];
  return (
    <PageLayout>
      <Card>
        <div className="media">
          <div className="media-left">
            <Avatar src={config.icon} />
          </div>
          <div className="media-content">
            This page doesn't support on <strong>{config.label}</strong>
            {"'s "}
            {network === MAINNET ? "Mainnet" : "Testnet"}.
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

export default NoNetworkSupport;
