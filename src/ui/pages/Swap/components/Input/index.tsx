import React from "react";
import { FaAngleDown } from "react-icons/fa";
import NumberFormat from "react-number-format";
import { Avatar } from "antd";
import { UNKNOWN_TOKEN_IMAGE } from "../../../../../consts/global";
import { IToken } from "../../../../../consts/tokens";

interface IInputProps {
  token?: IToken;
  val?: string;
  isLoading?: boolean;
  userBalance?: string;
  isDisabled?: boolean;
  notEnoughBalance?: boolean;
  price?: number;
  setValue: (val?: string) => void;
  onClickAsset: () => void;
}

const Input = ({
  token,
  val,
  isLoading,
  userBalance,
  isDisabled,
  notEnoughBalance,
  price,
  setValue,
  onClickAsset,
}: IInputProps) => {

  let usdPrice = "";

  if (price && val && val !== "0") {
    const _usdPrice = price * parseFloat(val);
    if (_usdPrice > 0.01) {
      usdPrice = "$" + _usdPrice.toFixed(2);
    }
  }
  return (
    <div>
      <div
        className="columns is-mobile"
        style={{ alignItems: "center", marginBottom: 0 }}
      >
        <div className="column">
          <div
            className={`control is-large ${
              isLoading ? "has-icons-right is-loading" : ""
            }`}
          >
            <NumberFormat
              placeholder="0.00"
              decimalScale={token ? token.decimals : undefined}
              inputMode="decimal"
              className={`input is-shadowless is-large is-borderless`}
              style={{ border: 0 }}
              value={val !== undefined ? val : ""}
              allowNegative={false}
              onValueChange={(value, e) => {
                if (e.source === "event") {
                  setValue(value.value);
                }
              }}
              thousandSeparator={true}
              allowLeadingZeros={false}
              disabled={isDisabled}
            />
          </div>
        </div>

        <div className="column is-narrow">
          <div>
            <button
              onClick={onClickAsset}
              className={`button is-small is-rounded ${
                token ? "is-light" : "is-light"
              }`}
            >
              {token ? (
                <>
                  <Avatar
                    className="icon is-small"
                    size="small"
                    src={token.icon ? token.icon : UNKNOWN_TOKEN_IMAGE}
                  />
                  <span className="has-text-weight-semibold">
                    {token.symbol}
                  </span>
                  <span className="icon is-small">
                    <FaAngleDown />
                  </span>
                </>
              ) : (
                <>
                  <span className="has-text-weight-semibold">Select Token</span>
                  <span className="icon is-small">
                    <FaAngleDown />
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="columns is-mobile" style={{ alignItems: "center" }}>
        <div className="column">
          <p className={`help has-text-grey`}>{usdPrice}</p>
        </div>

        <div className="column is-narrow">
          <div>
            <p
              onClick={(e) => {
                if (userBalance) {
                  setValue(userBalance);
                }
              }}
              className={`help has-text-righ is-clickable ${
                notEnoughBalance ? "has-text-danger" : ""
              }`}
            >
              Balance:{" "}
              {userBalance ? parseFloat(userBalance).toLocaleString() : "0"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Input;
