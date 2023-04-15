import React from "react";
import NumberFormat from "react-number-format";

interface ISlippageInputProps {
  slippage?: number;
  setSlippage: (v: any) => void;
  onSave: () => void;
}
const SlippageInput = ({
  slippage,
  setSlippage,
  onSave,
}: ISlippageInputProps) => {
  return (
    <>
      <div className="field">
        <label className="label">Slippage</label>
        <div className="control">
          <NumberFormat
            suffix={"%"}
            allowLeadingZeros={false}
            thousandSeparator={true}
            allowNegative={false}
            decimalScale={2}
            inputMode="decimal"
            className="input"
            value={slippage}
            onValueChange={(value) => {
              setSlippage(value.floatValue);
            }}
          />
        </div>
      </div>
      <button
        disabled={!slippage || slippage <= 0 || slippage >= 50}
        onClick={onSave}
        className="button is-primary"
      >
        Save change
      </button>
    </>
  );
};

export default SlippageInput;
