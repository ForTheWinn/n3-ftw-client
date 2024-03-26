import React from "react";
import { useHistory } from "react-router-dom";
import { UNKNOWN_TOKEN_IMAGE } from "../../../../consts/global";
import { CHAINS } from "../../../../consts/chains";
import { LOCKER_PATH } from "../../../../consts/routes";
import { toDecimal } from "../../../../packages/neo/utils";
import { getTokenByHash } from "../../../../common/helpers";
import { INetworkType } from "../../../../packages/neo/network";
interface ILockerTokenCardProps {
  chain: CHAINS;
  lockedAmount: number;
  decimals: number;
  contractHash: string;
  symbol: string;
  network: INetworkType;
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
  const token = getTokenByHash(chain, network, contractHash);
  const logo = token && token.icon ? token.icon : UNKNOWN_TOKEN_IMAGE;
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
      <div className="is-accent">Locked</div>
      {`${amount.toLocaleString()} ${symbol}`}
    </div>
  );
};

export default LockerTokenCard;
