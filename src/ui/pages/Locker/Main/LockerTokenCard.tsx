import React from "react";
import { u } from "@cityofzion/neon-core";
import { useHistory } from "react-router-dom";
import { UNKNOWN_TOKEN_IMAGE } from "../../../../consts/global";
import { TOKEN_LIST } from "../../../../consts/tokens";
import { CHAINS } from "../../../../consts/chains";
import { LOCKER_PATH } from "../../../../consts/routes";
import { toDecimal } from "../../../../packages/neo/utils";
interface ILockerTokenCardProps {
  chain: CHAINS;
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
  symbol,
}: ILockerTokenCardProps) => {
  const history = useHistory();
  const logo = TOKEN_LIST[chain][network][contractHash]
    ? TOKEN_LIST[chain][network][contractHash].icon
    : UNKNOWN_TOKEN_IMAGE;
  const amount = toDecimal(lockedAmount, decimals);
  return (
    <div
      onClick={() => {
        history.push(`${LOCKER_PATH}/contracts/${contractHash}`);
      }}
      className="box is-shadowless has-text-centered is-hoverable"
    >
      <img style={{ width: "64px" }} src={logo} />
      <br />
      <div className="heading">Locked</div>
      {`${amount.toLocaleString()} ${symbol}`}
    </div>
  );
};

export default LockerTokenCard;
