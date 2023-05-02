import React, { useState } from "react";
import { numberTrim } from "../../../../../../../packages/neo/utils";
interface IPriceRationProps {
  amountA: string;
  amountB: string;
  symbolA: string;
  symbolB: string;
  decimalsA: number;
  decimalsB: number;
}
const PriceRatio = ({
  amountA,
  amountB,
  symbolA,
  symbolB,
  decimalsA,
  decimalsB,
}: IPriceRationProps) => {
  const [isReversed, setReversed] = useState(false);
  let ratio = parseFloat(amountA) / parseFloat(amountB);
  if (isReversed) {
    ratio = parseFloat(amountB) / parseFloat(amountA);
  }
  return (
    <p onClick={() => setReversed(!isReversed)} className="is-clickable">
      {`1 ${isReversed ? symbolA : symbolB} = ${numberTrim(ratio, isReversed ? decimalsA : decimalsB)} ${
        isReversed ? symbolB : symbolA
      }`}
    </p>
  );
};

export default PriceRatio;
