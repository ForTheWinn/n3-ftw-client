import { wallet } from "@cityofzion/neon-core";
import React, { useState } from "react";
import NumberFormat from "react-number-format";
import { IExcelData } from ".";
import { useApp } from "../../../../../common/hooks/use-app";
import { toolsRouter } from "../../../../../common/routers";

interface INewWalletGeneratorProps {
  onSubmit: (list: IExcelData[][]) => void;
}
const NewWalletGenerator = ({ onSubmit }: INewWalletGeneratorProps) => {
  const { chain } = useApp();
  const [amount, setAmount] = useState<number | undefined>();
  const handleSubmit = () => {
    if (amount && amount > 0) {
      const list = toolsRouter.generatePrivatekeys(chain, amount);
      onSubmit(list);
    }
  };
  return (
    <div>
      <div className="field">
        <label className="label">How many wallets?</label>
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

export default NewWalletGenerator;
