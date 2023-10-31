import React from "react";
import Level from "../../../../components/Level";
import { Avatar, Space } from "antd";
import { useBridgeSwap } from "./context";

const ChainSelector = () => {
  const { originChain, destChain, setChainSelectModalActive } = useBridgeSwap();
  console.log(originChain)
  return (
    <div className="box is-shadowless mb-1">
      <Level
        left={
          <Space>
            <span>Origin</span>
            <button className="button is-rounded is-white is-hovered is-small">
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
              className="button is-rounded  is-small"
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
