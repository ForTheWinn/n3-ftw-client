import React from "react";
import { u } from "@cityofzion/neon-core";
import { useHistory } from "react-router-dom";
import { CHAINS, NEO_ROUTES } from "../../../../consts";
import { UNKNOWN_TOKEN_IMAGE } from "../../../../consts/global";
import { TOKEN_LIST } from "../../../../consts/tokens";
interface ILockerTokenCardProps {
  chain: CHAINS.CHAINS;
  lockedAmount: number;
  decimals: number;
  contractHash: string;
  symbol: string;
  network: string;
}
const LockerTokenCard = ({
  chain,
  network,
  lockedAmount,
  decimals,
  contractHash,
  symbol
}: ILockerTokenCardProps) => {
  const history = useHistory();
  const logo = TOKEN_LIST[chain][network][contractHash]
    ? TOKEN_LIST[chain][network][contractHash].icon
    : UNKNOWN_TOKEN_IMAGE;
  const amount = parseFloat(
    u.BigInteger.fromNumber(lockedAmount).toDecimal(decimals)
  );
  return (
    <div
      onClick={() => {
        history.push(`${NEO_ROUTES.LOCKER_PATH}/contracts/${contractHash}`);
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
