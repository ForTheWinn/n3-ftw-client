import React, { useState } from "react";
import HeaderBetween from "../../../../components/Commons/HeaderBetween";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { StakingContract } from "../../../../../packages/neo/contracts/ftw/farm";
import ConnectWalletButton from "../../../../components/ConnectWalletButton";
import LPTokenList from "./LPTokenList";
import { handleError } from "../../../../../packages/neo/utils/errors";
import { useApp } from "../../../../../common/hooks/use-app";
import { FARM_PATH } from "../../../../../consts/routes";

const Stake = ({ onRefresh }) => {
  const { network, setTxid } = useApp();
  const { connectedWallet } = useNeoWallets();
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

  return (
    <div>
      <HeaderBetween path={FARM_PATH} title={`Stake LP tokens`} />
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
    </div>
  );
};

export default Stake;
