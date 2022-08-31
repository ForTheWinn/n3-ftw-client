import React from "react";
import { FaAngleDown, FaInfoCircle } from "react-icons/fa";
import NumberFormat from "react-number-format";
import { useWallet } from "../../../../../packages/provider";
import { ASSET_LIST } from "../../../../../packages/neo/contracts/ftw/swap/consts";
import LogoIcon from "../../../../components/LogoIcon";
import { BsQuestionSquare } from "react-icons/bs";

interface IInputProps {
  contractHash: string;
  symbol?: string;
  logo?: string;
  val?: number;
  heading?: string;
  isLoading?: boolean;
  setValue: (val?: number) => void;
  onClickAsset: () => void;
  isReadOnly?: boolean;
  userBalance?: number;
  isDisable?: boolean;
  errorMessage?: string;
  decimals?: number;
  balanceOverflow?: boolean;
}
const Input = ({
  contractHash,
  isDisable,
  symbol,
  logo,
  val,
  heading,
  setValue,
  onClickAsset,
  isLoading,
  isReadOnly,
  userBalance,
  errorMessage,
  decimals,
  balanceOverflow,
}: IInputProps) => {
  const { network } = useWallet();
  let logoIcon;
  if (logo) {
    logoIcon = logo;
  } else {
    logoIcon = ASSET_LIST[network][contractHash]
      ? ASSET_LIST[network][contractHash].logo
      : undefined;
  }
  // const noFund = userBalance && val && val > userBalance
  return (
    <div>
      <div className="columns is-mobile" style={{ alignItems: "center" }}>
        <div className="column is-narrow">
          <div className="level is-mobile">
            <div className="level-left">
              <div className="level-item mr-4 is-hidden-mobile">
                {logoIcon ? (
                  <LogoIcon width="35px" height="35px" img={logoIcon} />
                ) : (
                  <div
                    className="circular--portrait"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                      borderRadius: "50%",
                      background: "white",
                      width: "35px",
                      height: "35px",
                    }}
                  >
                    <BsQuestionSquare size={25} />
                  </div>
                )}
              </div>
              <div className="level-item">
                <div
                  onClick={onClickAsset}
                  className="is-clickable"
                  style={{ width: "60px" }}
                >
                  {heading && <p className="heading">{heading}</p>}
                  <div style={{ alignItems: "center", display: "flex" }}>
                    <span className="has-text-weight-bold">
                      {symbol ? symbol : "Select"}
                    </span>
                    <span className="icon">
                      <FaAngleDown />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="column">
          <div className={`control ${isLoading ? "is-loading" : ""}`}>
            <NumberFormat
              disabled={isDisable}
              readOnly={isReadOnly}
              placeholder="0.00"
              decimalScale={decimals !== undefined ? decimals : 8}
              inputMode="decimal"
              className={`input ${balanceOverflow ? "is-danger" : ""}`}
              value={val !== undefined ? val : ""}
              allowNegative={false}
              onValueChange={(value, e) => {
                if (e.source === "event") {
                  setValue(value.floatValue);
                }
              }}
              thousandSeparator={true}
              suffix={` ${symbol ? symbol : ""}`}
              allowLeadingZeros={false}
            />
            <div style={{ position: "absolute", width: "100%" }}>
              {errorMessage ? (
                <p className="help is-danger has-text-right">{errorMessage}</p>
              ) : userBalance !== undefined ? (
                <p
                  onClick={(e) => {
                    if (userBalance) {
                      // @ts-ignore
                      setValue(userBalance, e);
                    }
                  }}
                  className={`help has-text-right ${
                    userBalance && userBalance > 0 ? "is-clickable" : ""
                  }`}
                >
                  {userBalance ? userBalance.toLocaleString() : 0}{" "}
                  {symbol ? symbol : ""}
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
