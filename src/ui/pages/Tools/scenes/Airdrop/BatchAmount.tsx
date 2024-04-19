import React, { useState } from "react";
import NumberFormat from "react-number-format";

interface IBatchAmountProps {
  onSubmit: (amount: number) => void;
}
const BatchAmount = ({ onSubmit }: IBatchAmountProps) => {
  const [amount, setAmount] = useState<number | undefined>();
  const handleSubmit = () => {
    if (amount && amount > 0) {
      onSubmit(amount);
    }
  };
  return (
    <div>
      <div className="field">
        <label className="label">Amount</label>
        <div className="columns">
          <div className="column">
            <NumberFormat
              allowLeadingZeros={false}
              thousandSeparator={true}
              allowNegative={false}
              inputMode="decimal"
              className="input is-shadowless"
              placeholder={"Amount"}
              onValueChange={(value) => {
                setAmount(value.floatValue);
              }}
            />
          </div>
          <div className="column is-narrow">
            <button
              disabled={!amount}
              onClick={handleSubmit}
              className="button is-success"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchAmount;
