import React from "react";

import { Collapse } from "antd";
import { BRIDGE_NEP_FEE_FORMATTED } from "../../../../../consts/bridge";
import { INetworkType } from "../../../../../packages/neo/network";
import { IBridgeChain } from "../../../../../common/routers/bridge/interfaces";
import { IBridgeSelectedtoken } from "../../interfaces";
import {
  getExplorer,
  getExplorerByChainId,
} from "../../../../../common/helpers";

const { Panel } = Collapse;

interface IBridgeDetailsProps {
  originChain: IBridgeChain;
  destChain: IBridgeChain;
  network: INetworkType;
  token: IBridgeSelectedtoken;
}
const BridgeDetails = ({
  network,
  originChain,
  destChain,
  token,
}: IBridgeDetailsProps) => {
  console.log(originChain);
  console.log(destChain);
  console.log(token);
  return (
    <div className="mt-1">
      <Collapse
        size="small"
        collapsible="icon"
        bordered={false}
        defaultActiveKey={[]}
        style={{ background: "white" }}
      >
        <Panel
          header={
            <div>Bridge fee: {BRIDGE_NEP_FEE_FORMATTED[network]} NEP</div>
          }
          key="1"
        >
          <div className="box is-shadowless content is-small has-background-light">
            <p>Bridge fee will be overdrawn from your wallet.</p>
            <div className="level is-mobile mb-2">
              <div className="level-left">
                <div className="level-item">{`${token.symbol} contract on ${originChain.name}`}</div>
              </div>
              <div className="level-right">
                <div className="level-item has-text-right">
                  <a
                    target="_blank"
                    href={`${getExplorerByChainId(originChain.chainId, "tx")}/${
                      token.hash
                    }`}
                    rel="noreferrer"
                  >
                    Open
                  </a>
                </div>
              </div>
            </div>
            <div className="level is-mobile mb-2">
              <div className="level-left">
                <div className="level-item">{`${token.destToken.symbol} contract on ${destChain.name}`}</div>
              </div>
              <div className="level-right">
                <div className="level-item has-text-right">
                  <a
                    target="_blank"
                    href={`${getExplorerByChainId(destChain.chainId, "tx")}/${
                      token.destToken.hash
                    }`}
                    rel="noreferrer"
                  >
                    Open
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default BridgeDetails;
