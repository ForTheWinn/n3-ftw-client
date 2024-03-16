import React from "react";
import { Avatar, Collapse, Space } from "antd";

import { IToken } from "../../../../../../../consts/tokens";
import { getTokenByHash } from "../../../../../../../common/helpers";
import { INetworkType } from "../../../../../../../packages/neo/network";
import { CHAINS } from "../../../../../../../consts/chains";
import { SwapRightOutlined } from "@ant-design/icons";

const NativeTokenSwapRoutes = ({
  chain,
  network,
  isSwapWithWrapping,
  tokenA,
  tokenB,
}: {
  chain: CHAINS;
  network: INetworkType;
  isSwapWithWrapping: boolean;
  isSwapWithUnWrapping: boolean;
  tokenA: IToken;
  tokenB: IToken;
}) => {
  let pathes: IToken[] = [];

  if (isSwapWithWrapping) {
    const nativeToken = tokenA.nativePair
      ? getTokenByHash(chain, network, tokenA.nativePair.hash)
      : undefined;
    if (nativeToken) {
      pathes = [tokenA, nativeToken, tokenB];
    }
  } else {
    const nativeToken = tokenB.nativePair
      ? getTokenByHash(chain, network, tokenB.nativePair.hash)
      : undefined;
    if (nativeToken) {
      pathes = [tokenA, nativeToken, tokenB];
    }
  }
  return (
    <Collapse
      className="mt-1"
      bordered={false}
      style={{ background: "white" }}
      items={[
        {
          key: "1",
          label: (
            <Space>
              {pathes.map((p, i) => {
                return (
                  <Space key={"pair" + i}>
                    <Avatar
                      size="small"
                      style={{ background: "white" }}
                      key={"path-token" + i}
                      src={p.icon}
                    />
                    {i !== pathes.length - 1 && <SwapRightOutlined />}
                  </Space>
                );
              })}
            </Space>
          ),
          children: <span>Swap routes</span>,
        },
      ]}
    />
  );
};

export default NativeTokenSwapRoutes;
