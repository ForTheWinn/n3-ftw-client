import React, { useEffect, useState } from "react";
import Modal from "../../../../../../components/Modal";
import { NFTContract } from "../../../../../../../packages/neo/contracts";
import { useWallet } from "../../../../../../../packages/provider";
import AfterTransactionSubmitted from "../../../../../../../packages/ui/AfterTransactionSubmitted";
import { TournamentContract } from "../../../../../../../packages/neo/contracts/ftw/arena";
import { toast } from "react-hot-toast";
import {handleError} from "../../../../../../../packages/neo/utils/errors";

interface INFTListModalModal {
  arenaNo: string;
  onClose: () => void;
}
const NFTListModal = ({ arenaNo, onClose }: INFTListModalModal) => {
  const [txid, setTxid] = useState("");
  const [tokens, setTokens] = useState<any>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { connectedWallet, network, addPendingTransaction } = useWallet();

  const onRegister = async (tokenId: string) => {
    if (connectedWallet) {
      try {
        const res = await new TournamentContract(network).register(
          connectedWallet,
          tokenId,
          arenaNo
        );
        addPendingTransaction(res);
        setTxid(res);
      } catch (e: any) {
	      toast.error(handleError(e));
      }
    } else {
      toast.error("Please connect wallet.");
    }
  };

  useEffect(() => {
    async function fetchContractStatus() {
      setError("");
      setLoading(true);
      try {
        const res = await new NFTContract(network).getTokensOf(
          connectedWallet?.account.address
        );
        setTokens(res);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    if (connectedWallet) {
      fetchContractStatus();
    }
  }, [connectedWallet, network]);
  return (
    <Modal onClose={onClose}>
      <>
        {txid ? (
          <AfterTransactionSubmitted
            txid={txid}
            network={network}
            onSuccess={onClose}
            onError={() => setTxid("")}
          />
        ) : (
          <div>
            <div className="block">
              <h5 className="title is-5">Select a NFT to send to the ARENA</h5>
            </div>
            <div>
              {isLoading ? (
                <div>Loading..</div>
              ) : error ? (
                <div>{error}</div>
              ) : tokens.length > 0 ? (
                <div
                  style={{
                    flexFlow: "wrap",
                  }}
                  className="is-flex"
                >
                  {tokens.map((token) => {
                    return (
                      <figure
                        key={token.tokenId}
                        // style={{ width, height }}
                        className="image is-64x64"
                        onClick={() => onRegister(token.tokenId)}
                      >
                        <img src={token.image} />
                      </figure>
                    );
                  })}
                </div>
              ) : (
                <div>You don't have runes</div>
              )}
            </div>
          </div>
        )}
      </>
    </Modal>
  );
};

export default NFTListModal;
