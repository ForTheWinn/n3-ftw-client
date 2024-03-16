import React from "react";
import { getAfterSlippage } from "../../../../../../../packages/neo/contracts/ftw/swap/helpers";
import { numberTrim } from "../../../../../../../packages/neo/utils";
import { priceImpactFormat } from "../../helpers";

import { IToken } from "../../../../../../../consts/tokens";
import PriceRatio from "./PriceRatio";
import { Collapse, Divider } from "antd";

interface ISwapDetailsProps {
  tokenA: IToken;
  tokenB: IToken;
  amountA: string;
  amountB: string;
  priceImpact: number;
  slippage: number;
}
const SwapDetails = ({
  tokenA,
  tokenB,
  amountA,
  amountB,
  slippage,
  priceImpact,
}: ISwapDetailsProps) => {
  const tolerance = numberTrim(
    parseFloat(getAfterSlippage(amountB, slippage)),
    tokenB.decimals
  );
  const expected = numberTrim(parseFloat(amountB), tokenB.decimals);

  return (
    <Collapse
      className="mt-1"
      bordered={false}
      style={{ background: "white" }}
      items={[
        {
          key: "1",
          label: (
            <PriceRatio
              symbolA={tokenA.symbol}
              symbolB={tokenB.symbol}
              amountA={amountA}
              amountB={amountB}
              decimalsA={tokenA.decimals}
              decimalsB={tokenB.decimals}
            />
          ),
          children: (
            <div className="box is-shadowless content is-small has-background-light">
              <div className="level is-mobile mb-2">
                <div className="level-left">
                  <div className="level-item">Expected output</div>
                </div>
                <div className="level-right">
                  <div className="level-item has-text-right">
                    {expected} {tokenB.symbol}
                  </div>
                </div>
              </div>
              <div className="level is-mobile is-marginless">
                <div className="level-left">
                  <div className="level-item">Price impact</div>
                </div>
                <div className="level-right">
                  <div className="level-item  has-text-right">
                    {priceImpactFormat(priceImpact)}
                  </div>
                </div>
              </div>
              <Divider className="mt-2 mb-2" />
              <div className="level is-mobile  is-marginless">
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
            </div>
          ),
        },
      ]}
    />
  );
};

export default SwapDetails;
