import React from "react";
import {  FaSyncAlt } from "react-icons/fa";
import InputDivider from "../../../Swap/components/InputDivider";
import Input from "../../../Swap/components/Input";
import {
  ISwapInputState,
  ITokenState
} from "../../../Swap/scenes/Swap/interfaces";
import NumberFormat from "react-number-format";
import { IBridgeSelectedtoken } from "../../interfaces";

interface ILPInputsProps {
  token?: IBridgeSelectedtoken;
  amount?: string;
  balance?: string;
  swapInput?: ISwapInputState;
  onAmountChange: (val: string | undefined) => void;
  openBridgeTokenList: () => void;
}

const BridgeInputs = ({
  token,
  amount,
  balance,
  onAmountChange,
  openBridgeTokenList
}: ILPInputsProps) => {
  return (
    <>
      <div className="box is-shadowless mb-0">
        <Input
          token={
            token
              ? {
                  hash: "",
                  icon: token.icon,
                  symbol: token.symbol,
                  decimals: token.decimals
                }
              : undefined
          }
          val={amount}
          isLoading={false}
          userBalance={balance ? balance : "0"}
          onClickAsset={openBridgeTokenList}
          setValue={(value) => {
            onAmountChange(value);
          }}
        />
      </div>

      <InputDivider icon={<FaSyncAlt />} />

      <div className="box is-shadowless mb-1">
        <div>
          <div
            className="columns is-mobile"
            style={{ alignItems: "center", marginBottom: 0 }}
          >
            <div className="column">
              <div className={`control is-large`}>
                <NumberFormat
                  readOnly
                  placeholder="0.00"
                  decimalScale={token ? token.decimals : undefined}
                  inputMode="decimal"
                  className={`input is-shadowless is-large is-borderless`}
                  style={{ border: 0 }}
                  value={amount !== undefined ? amount : ""}
                  allowNegative={false}
                  thousandSeparator={true}
                  allowLeadingZeros={false}
                />
              </div>
            </div>

            {/* <div className="column is-narrow"> */}
            <div>
              {/* {token ? (
                <button
                  onClick={() => {
                    onAssetChange("B");
                  }}
                  className={`button is-small is-rounded ${
                    tokenB ? "is-light" : "is-light"
                  }`}
                >
                  <Avatar
                    className="icon is-small"
                    size="small"
                    src={tokenB.icon ? tokenB.icon : UNKNOWN_TOKEN_IMAGE}
                  />
                  <span className="has-text-weight-semibold">
                    {tokenB.symbol}
                  </span>
                </button>
              ) : (
                <></>
              )} */}
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default BridgeInputs;
