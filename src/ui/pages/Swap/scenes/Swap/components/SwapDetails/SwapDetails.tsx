import React from "react";
import { getAfterSlippage } from "../../../../../../../packages/neo/contracts/ftw/swap/helpers";
import { numberTrim } from "../../../../../../../packages/neo/utils";
import { priceImpactFormat } from "../../helpers";

import { ITokenState } from "../../interfaces";
import PriceRatio from "./PriceRatio";
import { Collapse, Divider } from "antd";
const { Panel } = Collapse;

interface ISwapDetailsProps {
  tokenA: ITokenState;
  tokenB: ITokenState;
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
  priceImpact
}: ISwapDetailsProps) => {
  const tolerance = numberTrim(
    parseFloat(getAfterSlippage(amountB, slippage)),
    tokenB.decimals
  );
  const expected = numberTrim(parseFloat(amountB), tokenB.decimals);

  return (
    <div className="mt-1">
      <Collapse
        size="small"
        collapsible="icon"
        bordered={false}
        defaultActiveKey={[]}
        style={{ background: "white" }}
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
        </Panel>
      </Collapse>
    </div>
  );
};

export default SwapDetails;
