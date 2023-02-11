import React from "react";
import { Button, Drawer, theme } from "antd";
import NumberFormat from "react-number-format";

interface ISwapSettingsProps {
  isActive: boolean;
  onClose: () => void;
  slippage?: number;
  onSlippageChange: (val: any) => void;
}
const SwapSettings = ({
  isActive,
  onClose,
  slippage,
  onSlippageChange,
}: ISwapSettingsProps) => {
  return (
    <div>
      <Drawer
        title={
          <h5 className="title is-6 is-marginless">Settings</h5>
        }
        placement="left"
        closable={true}
        onClose={onClose}
        open={isActive}
        getContainer={false}
      >
        <>
          <label className="label is-size-7">Slippage</label>
          <div className="control">
            <NumberFormat
              suffix={"%"}
              allowLeadingZeros={false}
              thousandSeparator={true}
              allowNegative={false}
              decimalScale={2}
              inputMode="decimal"
              className="input is-small is-shadowless"
              value={slippage}
              onValueChange={(value) => {
                onSlippageChange(value.floatValue);
              }}
            />
          </div>
        </>
      </Drawer>
    </div>
  );
};

export default SwapSettings;
