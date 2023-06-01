import React from "react";

// import Modal from "../../Modal";
import { Avatar, Modal, Space } from "antd";

import { INetworkType } from "../../../../../../../packages/neo/network";
import { CHAINS } from "../../../../../../../consts/chains";
import { BRIDGE_SUPPORTED_TOKENS } from "../../../../../../../packages/neo/contracts/ftw/bridge/consts";
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
  destChain
}: IAssetListModalProps) => {
  const tokenList: any[] = [];
  BRIDGE_SUPPORTED_TOKENS[network].forEach((t) => {
    if (t.addresses[originChain.chainId] && t.addresses[destChain.chainId]) {
      tokenList.push({
        symbol: t.symbol,
        decimals: t.decimals,
        icon: t.icon,
        originHash: t.addresses[originChain.chainId],
        destHash: t.addresses[destChain.chainId]
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
        bodyStyle={{ padding: "-10px" }}
        footer={
          <nav
            className="panel is-shadowless"
            style={{
              border: "1px solid #eee",
              height: "500px",
              overflowY: "auto"
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
