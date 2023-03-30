import React, { useEffect, useState } from "react";
import HeaderBetween from "../../../../../components/Commons/HeaderBetween";
import ConnectWalletButton from "../../../../../components/ConnectWalletButton";
import { useAccount } from "wagmi";
import { writeContract, waitForTransaction } from "@wagmi/core";
import {
  getLPTokens,
  isApprovedForAll,
  removeLiquidity,
  setApprovalForAll
} from "../../../../../../packages/polygon/swap";
import LPTokenCard from "./LPTokenCard";
import toast from "react-hot-toast";
import RemoveLiquidityModal from "./RemoveLiquidityModal";
import { POLYGON_SWAP_CONTRACT_HASH } from "../../../../../../packages/polygon";

interface IRemoveLiquidityProps {
  rootPath: string;
}

const RemoveLiquidity = ({ rootPath }: IRemoveLiquidityProps) => {
  const { isConnected, address } = useAccount();
  const [tokens, setTokens] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [txid, setTxid] = useState<string | undefined>();
  const [refresh, setRefresh] = useState(0);

  const [isActionModalActive, setActionModalActive] = useState(false);
  const [isApproved, setApproved] = useState(false);
  const [isApproving, setApproving] = useState(false);
  const [approveError, setApproveError] = useState(false);
  const [isFinished, setFinished] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const onRemoveLiquidity = async (tokenId: string) => {
    if (isConnected && address) {
      setActionModalActive(true);

      try {
        setApproveError(false);
        if (await isApprovedForAll(address, POLYGON_SWAP_CONTRACT_HASH)) {
          setApproved(true);
        } else {
          setApproving(true);
          const config = await setApprovalForAll(POLYGON_SWAP_CONTRACT_HASH);
          const res = await writeContract(config);
          await res.wait();
          setApproved(true);
          setApproving(false);
        }
      } catch (e: any) {
        console.error(e);
        setApproveError(true);
        if (e.reason) {
          toast.error(e.reason);
        }
      }
      try {
        setSubmitError(false);
        const config = await removeLiquidity(tokenId);
        const { hash } = await writeContract(config);
        setSubmitting(true);
        setTxid(hash);
        const data = await waitForTransaction({
          hash
        });
        console.log(data);
        setFinished(true);
        setSubmitting(false);
      } catch (e: any) {
        console.error(e);
        setSubmitError(true);
        if (e.reason) {
          toast.error(e.reason);
        }
      }
    }
  };

  const onReset = () => {
    setRefresh(refresh + 1);
    setApproved(false);
    setApproving(false);
    setApproveError(false);
    setFinished(false);
    setSubmitting(false);
    setSubmitError(false);
    setTxid(undefined);
    setActionModalActive(false);
  };

  useEffect(() => {
    const load = async (_address: string) => {
      setLoading(true);
      try {
        const res = await getLPTokens(_address);
        setTokens(res as any);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    if (isConnected && address) {
      load(address);
    }
  }, [isConnected, address, refresh]);

  return (
    <>
      <HeaderBetween path={rootPath} title={"Withdraw liquidity"} />
      <hr />
      {isConnected ? (
        <>
          {isLoading ? (
            <div>Loading..</div>
          ) : tokens.length > 0 ? (
            tokens.map(({ tokenId }: any) => {
              return (
                <div key={tokenId}>
                  <LPTokenCard
                    tokenId={tokenId}
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

      {isActionModalActive && (
        <RemoveLiquidityModal
          txid={txid}
          isApproved={isApproved}
          isApproving={isApproving}
          approveError={approveError}
          isFinished={isFinished}
          isRemoving={isSubmitting}
          submitError={submitError}
          onClose={onReset}
        />
      )}
    </>
  );
};

export default RemoveLiquidity;
