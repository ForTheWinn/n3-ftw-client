import React, { useState } from "react";
import { u } from "@cityofzion/neon-core";
import { getAfterSlippage } from "../../../../../../../packages/neo/contracts/ftw/swap/helpers";
import { numberTrim } from "../../../../../../../packages/neo/utils";
import { priceImpactFormat } from "../../helpers";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

import SettingDropdown from "../SettingDropdown";
import { ITokenState } from "../../interfaces";
import PriceRatio from "./PriceRatio";

interface ISwapDetailsProps {
  tokenA: ITokenState;
  tokenB: ITokenState;
  amountA: number;
  amountB: number;
  priceImpact: number;
  slippage: number;
  setSlippage: (val: number) => void;
}
const SwapDetails = ({
  tokenA,
  tokenB,
  amountA,
  amountB,
  slippage,
  priceImpact,
  setSlippage,
}: ISwapDetailsProps) => {
  const [isActive, setActive] = useState(false);

  const tolerance = numberTrim(
    getAfterSlippage(amountB, slippage),
    tokenB.decimals
  );
  const expected = numberTrim(amountB, tokenB.decimals);

  return (
    <>
      <hr />
      <div className="level">
        <div className="level-left">
          <div className="level-item">
            <PriceRatio
              symbolA={tokenA.symbol}
              symbolB={tokenB.symbol}
              amountA={amountA}
              amountB={amountB}
            />
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <button
              onClick={() => setActive(!isActive)}
              className="button is-small is-white"
            >
              {isActive ? <FaCaretUp /> : <FaCaretDown />}
            </button>
          </div>
        </div>
      </div>
      {isActive && (
        <div className="notification content is-small">
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
                Minimum received after slippage
                <br /> ({slippage} %)
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

          {/* <div className="level mb-1 is-mobile">
            <div className="level-left">
              <div className="level-item">Liquidity provider fee</div>
            </div>
            <div className="level-right">
              <div className="level-item">0.25%</div>
            </div>
          </div> */}
        </div>
      )}
    </>
  );
};

export default SwapDetails;
