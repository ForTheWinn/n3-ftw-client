import React, { useState } from "react";
import HeaderBetween from "../../../../components/Commons/HeaderBetween";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { StakingContract } from "../../../../../packages/neo/contracts/ftw/farm";
import Modal from "../../../../components/Modal";
import AfterTransactionSubmitted from "../../../../components/NeoComponents/AfterTransactionSubmitted";
import ConnectWalletButton from "../../../../components/ConnectWalletButton";
import LPTokenList from "./LPTokenList";
import { handleError } from "../../../../../packages/neo/utils/errors";
import { NEO_ROUTES } from "../../../../../consts";
import { useApp } from "../../../../../common/hooks/use-app";

const Stake = ({ onRefresh }) => {
  const { network } = useApp();
  const { connectedWallet } = useNeoWallets();
  const [txid, setTxid] = useState("");
  const [refresh, setRefresh] = useState(0);

  const location = useLocation();
  let params = new URLSearchParams(location.search);

  // @ts-ignore
  const [symbolA] = useState<any>(
    params.get("tokenASymbol") ? params.get("tokenASymbol") : undefined
  );
  const [symbolB] = useState<any>(
    params.get("tokenBSymbol") ? params.get("tokenBSymbol") : undefined
  );

  const onStakeLP = async (tokenId) => {
    if (connectedWallet) {
      try {
        const res = await new StakingContract(network).stake(
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
    onRefresh();
    setRefresh(refresh + 1);
    setTxid("");
  };
  return (
    <div>
      <HeaderBetween path={NEO_ROUTES.FARM_PATH} title={`Stake LP tokens`} />
      <hr />
      {connectedWallet ? (
        <LPTokenList
          refresh={refresh}
          connectedWallet={connectedWallet}
          network={network}
          symbolA={symbolA}
          symbolB={symbolB}
          onStakeLP={onStakeLP}
          onRefresh={() => setRefresh(refresh + 1)}
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
    </div>
  );
};

export default Stake;
