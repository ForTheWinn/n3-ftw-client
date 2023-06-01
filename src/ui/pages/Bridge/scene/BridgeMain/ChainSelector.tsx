import React from "react";
import Level from "../../../../components/Level";
import { Avatar, Space } from "antd";
import { useBridgeSwap } from "./context";

const ChainSelector = () => {
  const { originChain, destChain, setChainSelectModalActive } = useBridgeSwap();
  return (
    <div className="box is-shadowless mb-1">
      <Level
        left={
          <Space>
            <span>Origin</span>
            <button
              // disabled
              // onClick={() => setChainSelectModalActive("A")}
              className="button is-rounded is-white is-hovered"
            >
              {originChain ? (
                <Space>
                  <Avatar size="small" src={originChain.icon} />
                  <span>{originChain.name}</span>
                </Space>
              ) : (
                "Select"
              )}
            </button>
          </Space>
        }
        right={
          <Space>
            <span>Destination</span>{" "}
            <button
              onClick={() => setChainSelectModalActive("B")}
              className="button is-rounded"
            >
              {destChain ? (
                <Space>
                  <Avatar size="small" src={destChain.icon} />
                  <span>{destChain.name}</span>
                </Space>
              ) : (
                "Select"
              )}
            </button>
          </Space>
        }
      />
    </div>
  );
};

export default ChainSelector;
