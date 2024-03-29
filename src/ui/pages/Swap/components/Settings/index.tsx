import React from "react";
import { Drawer } from "antd";
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
    <Drawer
      width="100%"
      title={<h5 className="title is-6 is-marginless">Settings</h5>}
      placement="left"
      closable={true}
      onClose={onClose}
      open={isActive}
      getContainer={false}
    >
      <>
        <label className="label is-size-7">Slippage</label>
        <NumberFormat
          suffix={"%"}
          allowLeadingZeros={false}
          thousandSeparator={true}
          allowNegative={false}
          decimalScale={2}
          inputMode="decimal"
          className="input is-shadowless"
          value={slippage}
          onValueChange={(value) => {
            onSlippageChange(value.floatValue);
          }}
          isAllowed={(values) => {
            const { floatValue, formattedValue } = values;
            // @ts-ignore
            return floatValue < 0.01 || floatValue <= 99;
          }}
        />
      </>
    </Drawer>
  );
};

export default SwapSettings;
