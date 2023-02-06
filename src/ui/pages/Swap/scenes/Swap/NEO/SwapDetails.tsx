import React from "react";
import { u } from "@cityofzion/neon-core";
import { getAfterSlippage } from "../../../../../../packages/neo/contracts/ftw/swap/helpers";
import { numberTrim } from "../../../../../../packages/neo/utils";
import { priceImpactFormat } from "../helpers";

import SettingDropdown from "../components/SettingDropdown";

interface ISwapDetailsProps {
  tokenA: any;
  tokenB: any;
  data: any;
  amountB: number;
  slippage: number;
  setSlippage: (val: number) => void;
}
const SwapDetails = ({
  data,
  tokenA,
  tokenB,
  amountB,
  slippage,
  setSlippage,
}: ISwapDetailsProps) => {
  let priceImpact = 0;
  const reserve = u.BigInteger.fromNumber(
    data.pair[tokenB.hash].reserveAmount
  ).toDecimal(tokenB.decimals);

  priceImpact = (amountB / parseFloat(reserve)) * 100;

  console.log(
    tokenA.symbol + " reserve: " + data.pair[tokenA.hash].reserveAmount
  );
  console.log(
    tokenB.symbol + " reserve: " + data.pair[tokenB.hash].reserveAmount
  );
  console.log("Total shares: " + data.totalShare);
  console.log("Price impact: " + priceImpact.toString());

  const tolerance = numberTrim(
    getAfterSlippage(amountB, slippage),
    tokenB.decimals
  );
  const expected = numberTrim(amountB, tokenB.decimals);

  return (
    <div className="message content is-small">
      <div className="message-body" style={{ overflow: "scroll" }}>
        <div className="level mb-1 is-mobile">
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
        <div className="level mb-5 is-mobile">
          <div className="level-left">
            <div className="level-item">Price impact</div>
          </div>
          <div className="level-right">
            <div className="level-item">{priceImpactFormat(priceImpact)}</div>
          </div>
        </div>

        <div className="level mb-1 is-mobile">
          <div className="level-left">
            <div className="level-item">
              Minimum received after slippage ({slippage} %)
            </div>
          </div>
          <div className="level-right">
            <div className="level-item has-text-right">
              <SettingDropdown
                amount={tolerance}
                symbol={tokenB.symbol}
                slippage={slippage}
                setSlippage={setSlippage}
              />
            </div>
          </div>
        </div>

        <div className="level mb-1 is-mobile">
          <div className="level-left">
            <div className="level-item">Liquidity provider fee</div>
          </div>
          <div className="level-right">
            <div className="level-item">0.25%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapDetails;
