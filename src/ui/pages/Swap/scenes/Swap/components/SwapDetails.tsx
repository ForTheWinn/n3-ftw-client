import { u } from "@cityofzion/neon-core";
import React from "react";
import { getAfterSlippage } from "../../../../../../packages/neo/contracts/ftw/swap/helpers";
import SettingDropdown from "./SettingDropdown";
import { numberTrim } from "../../../../../../packages/neo/utils";
import { priceImpactFormat } from "../helpers";

interface ISwapDetailsProps {
  decimalsB: number;
  amountB: number;
  symbolB: string;
  priceImpact: number;
  slippage: number;
  setSlippage: (val: number) => void;
}
const SwapDetails = ({
  decimalsB,
  amountB,
  symbolB,
  priceImpact,
  slippage,
  setSlippage,
}: ISwapDetailsProps) => {
  const tolerance = numberTrim(getAfterSlippage(amountB, slippage), decimalsB);
  const expected = numberTrim(amountB, decimalsB);
  return (
    <div className="message content is-small">
      <div className="message-body"  style={{ overflow: "scroll" }}>
        <div className="level mb-1 is-mobile">
          <div className="level-left">
            <div className="level-item">Expected output</div>
          </div>

          <div className="level-right">
            <div className="level-item has-text-right">
              <span className="has-text-weight-semibold">
                {expected} {symbolB}
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
                symbol={symbolB}
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
