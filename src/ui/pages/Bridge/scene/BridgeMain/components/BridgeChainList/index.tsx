import React from "react";

import { Avatar, Modal, Space } from "antd";

import { INetworkType } from "../../../../../../../packages/neo/network";
import { BRIDGE_CHAIN_LIST } from "../../../../../../../consts/bridge";
import { IBridgeChain } from "../../../../../../../common/routers/bridge/interfaces";

interface IAssetListModalProps {
  network: INetworkType;
  selectedChain?: IBridgeChain;
  onClose: () => void;
  onChainClick: (chain: IBridgeChain) => void;
}

const BridgeChainList = ({
  onClose,
  onChainClick,
  selectedChain,
  network
}: IAssetListModalProps) => {
  const chainList = BRIDGE_CHAIN_LIST(network).filter((chain) => {
    if (chain.chainId === selectedChain?.chainId) return false;
    if (chain.chains.length === 0) return false;
    return true;
  });
  return (
    <>
      <Modal
        style={{ padding: "0!important" }}
        title="Select a token"
        centered
        open={true}
        onCancel={onClose}
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
