import moment from "moment";
import React from "react";
import { ILPToken } from "../../../../../../../packages/neo/contracts/ftw/swap/interfaces";
import { useOnChainData } from "../../../../../../../common/hooks/use-onchain-data";
import { SwapContract } from "../../../../../../../packages/neo/contracts";
import { INetworkType } from "../../../../../../../packages/neo/network";
import { u } from "@cityofzion/neon-core";
import LPTokenCard from "../../components/LPTokenCard";
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
    <>
      <LPTokenCard
        tokenId={tokenId}
        sharePercentage={((amount / data.totalShare) * 100).toFixed(2)}
        tokenAAmount={withdrawA.toDecimal(data.pair[tokenA].decimals)}
        tokenBAmount={withdrawB.toDecimal(data.pair[tokenB].decimals)}
        tokenASymbol={data.pair[tokenA].symbol}
        tokenBSymbol={data.pair[tokenB].symbol}
        onClick={() => onRemove(tokenId)}
      />
    </>
  );
};

export default LPTokenItem;
