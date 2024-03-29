import React from "react";

import { Avatar, Modal, Space } from "antd";

import { INetworkType } from "../../../../../../../packages/neo/network";
import { BRIDGE_CHAINS } from "../../../../../../../consts/bridge";
import { IBridgeChain } from "../../../../../../../common/routers/bridge/interfaces";

interface IAssetListModalProps {
  network: INetworkType;
  selectedChain: IBridgeChain;
  onClose: () => void;
  onChainClick: (chain: IBridgeChain) => void;
}

const BridgeChainList = ({
  onClose,
  onChainClick,
  selectedChain,
  network,
}: IAssetListModalProps) => {
  const chainList = BRIDGE_CHAINS[network][selectedChain.chainId].chains.map(
    (chainId) => {
      return BRIDGE_CHAINS[network][chainId];
    }
  );
  return (
    <>
      <Modal
        style={{ padding: "0!important" }}
        title="Select a token"
        centered
        open={true}
        onCancel={onClose}
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
            {chainList.map((chain) => {
              return (
                <a
                  key={chain.chainId}
                  onClick={() => onChainClick(chain)}
                  className="panel-block is-clickable"
                >
                  <Space>
                    <Avatar size="small" src={chain.icon} />
                    {chain.name}
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

export default BridgeChainList;
