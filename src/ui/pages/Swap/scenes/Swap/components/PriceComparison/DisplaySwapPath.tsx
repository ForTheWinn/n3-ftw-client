import React, { useEffect, useState } from "react";
import { CHAINS } from "../../../../../../../consts/chains";
import { INetworkType } from "../../../../../../../packages/neo/network";
import { ITokenState } from "../../interfaces";
import { swapRouter } from "../../../../../../../common/routers";
import { Avatar, Space } from "antd";
import Level from "../../../../../../components/Level";
import { ethers } from "ethers";

interface IDisplaySwapPathProps {
  chain: CHAINS;
  network: INetworkType;
  path: ITokenState[];
  amountIn: number;
}
const DisplaySwapPath = ({
  path,
  network,
  chain,
  amountIn
}: IDisplaySwapPathProps) => {
  const [output, setOutput] = useState<string | undefined>();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function doLoad(_path, _amount) {
      setLoading(true);
      try {
        let swapAmount = ethers.utils
          .parseUnits(_amount.toString(), path[0].decimals)
          .toString();
        for (let i = 0; i < _path.length - 1; i++) {
          const tokenA = _path[i];
          const tokenB = _path[i + 1];
          swapAmount = await swapRouter.getEstimate(chain, network, {
            tokenA: tokenA.hash,
            tokenB: tokenB.hash,
            amount: swapAmount,
            isReverse: false
          });
        }
        setLoading(false);
        setOutput(
          parseFloat(swapAmount) > 0
            ? ethers.utils.formatUnits(
                swapAmount.toString(),
                path[path.length - 1].decimals
              ) +
                " " +
                path[path.length - 1].symbol
            : "--"
        );
      } catch (e) {
        console.error(e);
        setLoading(false);
        setError(true);
      }
    }
    doLoad(path, amountIn);
  }, [path, chain, network, amountIn]);
  return (
    <Level
      left={
        <Space>
          {path.map((p, i) => {
            return (
              <Space key={"pair" + i}>
                <Avatar
                  size="small"
                  style={{ background: "white" }}
                  key={"path-token" + i}
                  src={p.icon}
                />
              </Space>
            );
          })}
        </Space>
      }
      right={
        <div>{isLoading ? "loading" : error ? "failed" : `${output}`}</div>
      }
    />
  );
};

export default DisplaySwapPath;
