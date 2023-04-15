import React from "react";
import moment from "moment";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import { SwapContract } from "../../../../../packages/neo/contracts";
import { INetworkType } from "../../../../../packages/neo/network";
import { ILPToken } from "../../../../../packages/neo/contracts/ftw/swap/interfaces";
interface ILPTokenCardProps extends ILPToken {
  network: INetworkType;
  onStakeLP: (tokenId: string) => void;
}
const LPTokenCard = ({
  network,
  tokenId,
  name,
  amount,
  lock,
  onStakeLP,
  tokenA,
  tokenB,
}: ILPTokenCardProps) => {
  const now = moment.utc().valueOf();
  const expired = lock === "None" ? 0 : moment(lock).valueOf();
  const { isLoaded, data } = useOnChainData(() => {
    return new SwapContract(network).getReserve(tokenA, tokenB);
  }, [network]);
  if (!isLoaded) return <div></div>;
  return (
    <div className="media">
      <div className="media-content">
	      <div className="content">
		      <strong>{name}</strong>
		      <br />
		      <small>Share of pool / {((amount / data.totalShare) * 100).toFixed(2)}%</small>
	      </div>

	      <div className="control">
		      <div className="tags has-addons">
			      <span className="tag is-dark">Lock</span>
			      <span className="tag is-info">{lock}</span>
		      </div>
	      </div>
      </div>
      <div className="media-right">
        <button
          onClick={() => onStakeLP(tokenId)}
          className="button is-primary"
        >
          Stake
        </button>
      </div>
    </div>
  );
};

export default LPTokenCard;
