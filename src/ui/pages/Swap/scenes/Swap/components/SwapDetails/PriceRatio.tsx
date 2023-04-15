import React, { useState } from "react";
import { numberTrim } from "../../../../../../../packages/neo/utils";
interface IPriceRationProps {
  amountA: number;
  amountB: number;
  symbolA?: string;
  symbolB?: string;
}
const PriceRatio = ({
  amountA,
  amountB,
  symbolA,
  symbolB,
}: IPriceRationProps) => {
  const [isReversed, setReversed] = useState(false);
  let ratio = amountA / amountB;
  if (isReversed) {
    ratio = amountB / amountA;
  }
  return (
    <p
      onClick={() => setReversed(!isReversed)}
      className="is-size-7 is-clickable"
    >
      {`1 ${isReversed ? symbolA : symbolB} = ${numberTrim(ratio)} ${
        isReversed ? symbolB : symbolA
      }`}
    </p>
  );
};

export default PriceRatio;
