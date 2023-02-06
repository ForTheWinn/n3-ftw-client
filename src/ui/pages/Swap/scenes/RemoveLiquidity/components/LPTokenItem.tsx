import moment from "moment";
import React from "react";
import { ILPToken } from "../../../../../../packages/neo/contracts/ftw/swap/interfaces";
import { useOnChainData } from "../../../../../../common/hooks/use-onchain-data";
import { SwapContract } from "../../../../../../packages/neo/contracts";
import { INetworkType } from "../../../../../../packages/neo/network";
import { u } from "@cityofzion/neon-core";
interface ILPTokenListProps extends ILPToken {
  onRemove: (tokenId: string) => void;
  network: INetworkType;
}
const LPTokenItem = ({
  tokenA,
  tokenB,
  network,
  name,
  amount,
  lock,
  onRemove,
  tokenId,
}: ILPTokenListProps) => {
  const now = moment.utc().valueOf();
  const expired = lock === "None" ? 0 : moment(lock).valueOf();
  const { isLoaded, data } = useOnChainData(() => {
    return new SwapContract(network).getReserve(tokenA, tokenB);
  }, [network]);
  if (!isLoaded) return <div />;

  const withdrawA = u.BigInteger.fromNumber(data.pair[tokenA].reserveAmount)
    .mul(amount)
    .div(data.totalShare);

  const withdrawB = u.BigInteger.fromNumber(data.pair[tokenB].reserveAmount)
    .mul(amount)
    .div(data.totalShare);

  return (
    <div className="media">
      <div className="media-content">
        <p className="mb-2">
          <strong>{tokenId}</strong>
          <br />
          <small>
            Share of pool / {((amount / data.totalShare) * 100).toFixed(2)}%
          </small>
          <br />
          <small>
            {parseFloat(withdrawA.toDecimal(data.pair[tokenA].decimals))}{" "}
            {data.pair[tokenA].symbol} /{" "}
            {parseFloat(withdrawB.toDecimal(data.pair[tokenB].decimals))}{" "}
            {data.pair[tokenB].symbol}
          </small>
        </p>
        <div className="control">
          <div className="tags has-addons">
            <span className="tag is-dark">Locked until</span>
            <span className="tag is-info">{lock}</span>
          </div>
        </div>
      </div>
      <div className="media-right">
        <button
          disabled={now < expired}
          onClick={() => onRemove(tokenId)}
          className="button is-light is-small"
        >
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default LPTokenItem;
