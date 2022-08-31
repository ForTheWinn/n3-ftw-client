import React, { useState } from "react";
import { useWallet } from "../../../../../packages/provider";
import { SwapContract } from "../../../../../packages/neo/contracts";
import { toast } from "react-hot-toast";
import Modal from "../../../../components/Modal";
import AfterTransactionSubmitted from "../../../../../packages/ui/AfterTransactionSubmitted";
import HeaderBetween from "../../../../components/HeaderBetween";
import { SWAP_PATH } from "../../../../../consts";
import LPTokenList from "./LPTokenList";
import ConnectWalletButton from "../../../../components/ConnectWalletButton";
import {handleError} from "../../../../../packages/neo/utils/errors";

const RemoveLiquidity = () => {
  const { network, connectedWallet } = useWallet();
  const [txid, setTxid] = useState("");
  const [refresh, setRefresh] = useState(0);

  const onRemoveLiquidity = async (tokenId: string) => {
    if (connectedWallet) {
      try {
        const res = await new SwapContract(network).remove(
          connectedWallet,
          tokenId
        );
        setTxid(res);
      } catch (e: any) {
	      toast.error(handleError(e));
      }
    } else {
      toast.error("Please connect wallet");
    }
  };

  const onSuccess = () => {
    setRefresh(refresh + 1);
    setTxid("");
  };

  return (
    <>
      <HeaderBetween path={SWAP_PATH} title={"Withdraw liquidity"} />
      <hr />
      {connectedWallet ? (
        <LPTokenList
          connectedWallet={connectedWallet}
          network={network}
          refresh={refresh}
          onRemoveLiquidity={onRemoveLiquidity}
        />
      ) : (
        <ConnectWalletButton />
      )}

      {txid && (
        <Modal onClose={() => setTxid("")}>
          <AfterTransactionSubmitted
            txid={txid}
            network={network}
            onSuccess={onSuccess}
            onError={() => setTxid("")}
          />
        </Modal>
      )}
    </>
  );
};

export default RemoveLiquidity;
