import React from "react";

import { Avatar, Modal, Space } from "antd";

import { INetworkType } from "../../../../../../../packages/neo/network";
import { CHAINS } from "../../../../../../../consts/chains";
import { BRIDGE_SUPPORTED_TOKEN_LIST } from "../../../../../../../consts/bridge";
import { IBridgeSelectedtoken } from "../../../../interfaces";
import { IBridgeChain } from "../../../../../../../common/routers/bridge/interfaces";

interface IAssetListModalProps {
  chain: CHAINS;
  network: INetworkType;
  originChain: IBridgeChain;
  destChain: IBridgeChain;
  onClose: () => void;
  onAssetClick: (token: IBridgeSelectedtoken) => void;
}

const TokenList = ({
  network,
  onAssetClick,
  onClose,
  originChain,
  destChain,
}: IAssetListModalProps) => {
  const tokenList: IBridgeSelectedtoken[] = [];
  BRIDGE_SUPPORTED_TOKEN_LIST[network][originChain.chainId].forEach((t) => {
    if (t.pairs[destChain.chainId]) {
      tokenList.push({
        symbol: t.symbol,
        decimals: t.decimals,
        icon: t.icon,
        hash: t.hash,
        destToken: t.pairs[destChain.chainId],
      });
    }
  });

  return (
    <>
      <Modal
        style={{ padding: "0!important" }}
        title="Select a token"
        centered
        open={true}
        onCancel={onClose}
        // footer={null}
        styles={{ body: { padding: "-10px" } }}
        footer={
          <nav
            className="panel is-shadowless"
            style={{
              border: "1px solid #eee",
              height: "500px",
              overflowY: "auto",
            }}
          >
            {tokenList.map((token) => {
              return (
                <a
                  key={token.hash}
                  onClick={() => onAssetClick(token)}
                  className="panel-block is-clickable"
                >
                  <Space>
                    <Avatar size="small" src={token.icon} />
                    {token.symbol}
                  </Space>
                </a>
              );
            })}
          </nav>
        }
      ></Modal>
    </>
  );
};

export default TokenList;
