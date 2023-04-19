import React, { useState } from "react";
import { getAfterSlippage } from "../../../../../../../packages/neo/contracts/ftw/swap/helpers";
import { numberTrim } from "../../../../../../../packages/neo/utils";
import { priceImpactFormat } from "../../helpers";
import { CaretRightOutlined } from "@ant-design/icons";

import { ITokenState } from "../../interfaces";
import PriceRatio from "./PriceRatio";
import { Collapse } from "antd";
const { Panel } = Collapse;

interface ISwapDetailsProps {
  tokenA: ITokenState;
  tokenB: ITokenState;
  amountA: number;
  amountB: number;
  priceImpact: number;
  slippage: number;
}
const SwapDetails = ({
  tokenA,
  tokenB,
  amountA,
  amountB,
  slippage,
  priceImpact
}: ISwapDetailsProps) => {
  const [isActive, setActive] = useState(false);

  const tolerance = numberTrim(
    getAfterSlippage(amountB, slippage),
    tokenB.decimals
  );
  const expected = numberTrim(amountB, tokenB.decimals);

  return (
    <>
      <Collapse
        size="small"
        bordered={false}
        defaultActiveKey={[]}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
      >
        <Panel
          header={
            <PriceRatio
              symbolA={tokenA.symbol}
              symbolB={tokenB.symbol}
              amountA={amountA}
              amountB={amountB}
              decimalsA={tokenA.decimals}
              decimalsB={tokenB.decimals}
            />
          }
          key="1"
        >
          <div className="level">
            <div className="level-left">
              <div className="level-item">Expected output</div>
            </div>
            <div className="level-right">
              <div className="level-item has-text-right">
                <span className="has-text-weight-semibold">
                  {expected} {tokenB.symbol}
                </span>
              </div>
            </div>
          </div>
          <div className="level">
            <div className="level-left">
              <div className="level-item">Price impact</div>
            </div>
            <div className="level-right">
              <div className="level-item">{priceImpactFormat(priceImpact)}</div>
            </div>
          </div>
          <div className="level">
            <div className="level-left">
              <div className="level-item">
                Minimum received after slippage
                <br /> ({slippage} %)
              </div>
            </div>
            <div className="level-right">
              <div className="level-item has-text-right">
                {tolerance}
                <br /> {tokenB.symbol}
              </div>
            </div>
          </div>
        </Panel>
      </Collapse>
    </>
  );
};

export default SwapDetails;
