import React, { useEffect, useState } from "react";
import HeaderBetween from "../../../../../components/Commons/HeaderBetween";
import ConnectWalletButton from "../../../../../components/ConnectWalletButton";
import { useAccount } from "wagmi";
import { getLPTokens } from "../../../../../../packages/polygon/api";
import LPTokenCard from "./LPTokenCard";

interface IRemoveLiquidityProps {
  rootPath: string;
}

const RemoveLiquidity = ({ rootPath }: IRemoveLiquidityProps) => {
  const { isConnected, address } = useAccount();
  const [tokens, setTokens] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [txid, setTxid] = useState("");
  const [refresh, setRefresh] = useState(0);

  const onRemoveLiquidity = async (tokenId: string) => {
    // if (connectedWallet) {
    //   try {
    //     const res = await new SwapContract(network).remove(
    //       connectedWallet,
    //       tokenId
    //     );
    //     setTxid(res);
    //   } catch (e: any) {
    //     toast.error(handleError(e));
    //   }
    // } else {
    //   toast.error("Please connect wallet");
    // }
  };

  // const onSuccess = () => {
  //   setRefresh(refresh + 1);
  //   setTxid("");
  // };

  useEffect(() => {
    const load = async (_address: string) => {
      setLoading(true);
      try {
        const res = await getLPTokens(_address);
        console.log(res);
        setTokens(res as any);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    if (isConnected && address) {
      load(address);
    }
  }, [isConnected, address]);

  return (
    <>
      <HeaderBetween path={rootPath} title={"Withdraw liquidity"} />
      <hr />
      {isConnected ? (
        <>
          {isLoading ? (
            <div>Loading..</div>
          ) : tokens.length > 0 ? (
            tokens.map(({ tokenId, shares, tokenA, tokenB }: any) => {
              return (
                <div key={tokenId}>
                  <LPTokenCard
                    tokenId={tokenId.toString()}
                    sharePercentage={shares.toString()}
                    tokenA={tokenA}
                    tokenB={tokenB}
                    onClick={() => onRemoveLiquidity(tokenId.toString())}
                  />
                </div>
              );
            })
          ) : (
            <div>Your wallet doesn't have any LP tokens.</div>
          )}
        </>
      ) : (
        <ConnectWalletButton />
      )}
    </>
  );
};

export default RemoveLiquidity;
