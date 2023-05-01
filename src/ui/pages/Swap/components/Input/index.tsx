import React from "react";
import { FaAngleDown } from "react-icons/fa";
import NumberFormat from "react-number-format";
import { Avatar, Space } from "antd";
import { UNKNOWN_TOKEN_IMAGE } from "../../../../../consts/global";
import { FaInfoCircle } from "react-icons/fa";
import { ITokenState } from "../../scenes/Swap/interfaces";
interface IInputProps {
  token?: ITokenState;
  swapInitiated?: boolean;
  val?: number;
  heading?: string;
  isLoading?: boolean;
  setValue: (val?: number) => void;
  onClickAsset: () => void;
  isReadOnly?: boolean;
  userBalance?: number;
  isDisable?: boolean;
  errorMessage?: string;
  balanceOverflow?: boolean;
  hasEstimateError?: boolean;
}
const Input = ({
  token,
  isDisable,
  val,
  heading,
  setValue,
  onClickAsset,
  isLoading,
  isReadOnly,
  userBalance,
  errorMessage,
  balanceOverflow,
  hasEstimateError
}: IInputProps) => {
  return (
    <div>
    
      <div className="columns is-mobile" style={{ alignItems: "center" }}>
        <div className="column is-narrow">
          <div style={{ width: "130px" }}>
            <button
              onClick={onClickAsset}
              className={`button is-small is-rounded ${
                token ? "is-white" : "is-light"
              }`}
            >
              {token ? (
                <Space>
                  <Avatar
                    size="small"
                    src={token.icon ? token.icon : UNKNOWN_TOKEN_IMAGE}
                  />
                  <span className="has-text-weight-semibold">
                    {token.symbol}
                  </span>
                  <span className="icon">
                    <FaAngleDown />
                  </span>
                </Space>
              ) : (
                "Select Token"
              )}
            </button>
          </div>
        </div>
        <div className="column">
          <div
            className={`control is-large ${
              hasEstimateError ? "has-icons-right" : ""
            } ${isLoading ? "has-icons-right is-loading" : ""}`}
          >
            <NumberFormat
              disabled={isDisable}
              readOnly={isReadOnly}
              placeholder="0.00"
              decimalScale={token ? token.decimals : undefined}
              inputMode="decimal"
              className={`input is-shadowless is-large is-borderless ${
                balanceOverflow ? "is-danger" : ""
              }`}
              value={val !== undefined ? val : ""}
              allowNegative={false}
              onValueChange={(value, e) => {
                if (e.source === "event") {
                  setValue(value.floatValue);
                }
              }}
              thousandSeparator={true}
              // suffix={token?.symbol}
              allowLeadingZeros={false}
            />
            {hasEstimateError ? (
              <span className="icon is-large is-right">
                <FaInfoCircle className="has-text-danger" />
              </span>
            ) : (
              <></>
            )}

            <div style={{ position: "absolute", width: "100%" }}>
              {errorMessage ? (
                <p className="help is-danger has-text-right">{errorMessage}</p>
              ) : userBalance !== undefined ? (
                <p
                  onClick={(e) => {
                    if (userBalance) {
                      setValue(userBalance);
                    }
                  }}
                  className={`help has-text-right ${
                    userBalance && userBalance > 0 ? "is-clickable" : ""
                  }`}
                >
                  Balance: {userBalance ? userBalance.toLocaleString() : 0}{" "}
                </p>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Input;
