import { u } from "@cityofzion/neon-core";
import React from "react";
import { ASSET_LIST } from "../../../../packages/neo/contracts/ftw/swap/consts";
import { useHistory } from "react-router-dom";
import { LOCKER_PATH } from "../../../../consts";
import {UNKNOWN_TOKEN_IMAGE} from "../../../../packages/neo/consts";
interface ILockerTokenCardProps {
  lockedAmount: number;
  decimals: number;
  contractHash: string;
  symbol: string;
  network: string;
}
const LockerTokenCard = ({
  network,
  lockedAmount,
  decimals,
  contractHash,
  symbol,
}: ILockerTokenCardProps) => {
  const history = useHistory();
  const logo = ASSET_LIST[network][contractHash]
    ? ASSET_LIST[network][contractHash].logo
    : UNKNOWN_TOKEN_IMAGE;
  const amount = parseFloat(
    u.BigInteger.fromNumber(lockedAmount).toDecimal(decimals)
  );
  return (
    <div
      onClick={() => {
        history.push(`${LOCKER_PATH}/contracts/${contractHash}`);
      }}
      className="box has-text-centered is-hoverable"
    >
      <img style={{ width: "64px" }} src={logo} />
      <br />
      <div className="heading">Locked</div>
      {`${amount.toLocaleString()} ${symbol}`}
    </div>
  );
};

export default LockerTokenCard;
