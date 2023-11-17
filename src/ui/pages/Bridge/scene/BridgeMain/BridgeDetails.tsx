import React from "react";

import { Collapse } from "antd";
import { IBridgeChain } from "../../../../../common/routers/bridge/interfaces";
import { IBridgeSelectedtoken } from "../../interfaces";
import { getExplorerByChainId } from "../../../../../common/helpers";
import { toDecimal } from "../../../../../packages/neo/utils";

const { Panel } = Collapse;

interface IBridgeDetailsProps {
  originChain: IBridgeChain;
  destChain: IBridgeChain;
  token: IBridgeSelectedtoken;
  fee: string;
}
const BridgeDetails = ({
  originChain,
  destChain,
  token,
  fee,
}: IBridgeDetailsProps) => {
  return (
    <div className="mt-1">
      <Collapse
        size="small"
        collapsible="icon"
        bordered={false}
        defaultActiveKey={[]}
        style={{ background: "white" }}
      >
        <Panel header={<div>Bridge Fee: {fee} NEP</div>} key="1">
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
                    href={`${getExplorerByChainId(
                      originChain.chainId,
                      "contract"
                    )}/${token.hash}`}
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
                    href={`${getExplorerByChainId(
                      destChain.chainId,
                      "contract"
                    )}/${token.destToken.hash}`}
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
