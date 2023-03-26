import React, { useState } from "react";
import { FARM_V2_PATH } from "../../../../../consts";
import HeaderBetween from "../../../../components/Commons/HeaderBetween";
import { useWallet } from "../../../../../packages/provider";
import { toast } from "react-hot-toast";
import Modal from "../../../../components/Modal";
import AfterTransactionSubmitted from "../../../../components/NeoComponents/AfterTransactionSubmitted";
import ConnectWalletButton from "../../../../components/ConnectWalletButton";
import LPTokenList from "./LPTokenList";
import { handleError } from "../../../../../packages/neo/utils/errors";
import { FarmV2Contract } from "../../../../../packages/neo/contracts/ftw/farm-v2";
import { useWalletRouter } from "../../../../../common/hooks/use-wallet-router";
import { CHAINS } from "../../../../../packages/chains/consts";
import { INetworkType } from "../../../../../packages/neo/network";

interface IStakeProps {
  chain: CHAINS;
  onRefresh: () => void;
  network: INetworkType;
}
const Stake = ({ chain, onRefresh, network }: IStakeProps) => {
  const { isConnected, address } = useWalletRouter(chain);
  const [txid, setTxid] = useState("");
  const [refresh, setRefresh] = useState(0);

  // const onStakeLP = async (tokenId) => {
  //   if (connectedWallet) {
  //     try {
  //       const res = await new FarmV2Contract(network).stake(
  //         connectedWallet,
  //         tokenId
  //       );
  //       setTxid(res);
  //     } catch (e: any) {
  //       toast.error(handleError(e));
  //     }
  //   } else {
  //     toast.error("Please connect wallet");
  //   }
  // };

  const onSuccess = () => {
    onRefresh();
    setRefresh(refresh + 1);
    setTxid("");
  };

  const onStake = (tokenId: string) => {};

  return (
    <div>
      <HeaderBetween path={FARM_V2_PATH} title={`Stake LP tokens`} />
      <hr />
      {isConnected ? (
        <LPTokenList
          chain={chain}
          refresh={refresh}
          address={address}
          network={network}
          onStake={onStake}
          onRefresh={() => setRefresh(refresh + 1)}
        />
      ) : (
        <ConnectWalletButton />
      )}

      {/* {txid && (
        <Modal onClose={() => setTxid("")}>
          <AfterTransactionSubmitted
            txid={txid}
            // network={network}
            onSuccess={onSuccess}
            onError={() => setTxid("")}
          />
        </Modal>
      )} */}
    </div>
  );
};

export default Stake;
