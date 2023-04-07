import React, { useEffect, useState } from "react";
import Modal from "../../../../components/Modal";
import { Steps } from "antd";
import { writeContract } from "@wagmi/core";
import LoadingWithText from "../../../../components/Commons/LoadingWithText";
import { CHAINS, NEO_CHAIN } from "../../../../../consts/chains";
import { INetworkType } from "../../../../../packages/neo/network";
import { swapRouter } from "../../../../../common/routers";
import { getExploler } from "../../../../../helpers";
import {
  isApprovedForAll,
  setApprovalForAll
} from "../../../../../packages/polygon/contracts/swap";
import { CONTRACTS } from "../../../../../consts";
import { SWAP } from "../../../../../consts/global";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import { waitTransactionUntilSubmmited } from "../../../../../common/routers/global";

interface IActionModalProps {
  chain: CHAINS;
  network: INetworkType;
  address: string;
  tokenId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const RemoveLiquidityModal = ({
  chain,
  network,
  address,
  tokenId,
  onSuccess,
  onCancel
}: IActionModalProps) => {
  const { connectedWallet } = useNeoWallets();
  const [isApproved, setApproved] = useState(false);
  const [isApproving, setApproving] = useState(false);
  const [approveError, setApproveError] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [isFinished, setFinished] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [txid, setTxid] = useState<string | undefined>();

  let currentStep = 0;
  if (isApproved) {
    currentStep = 1;
  }

  useEffect(() => {
    const doAction = async () => {
      if (chain !== NEO_CHAIN) {
        try {
          const contractAddress = CONTRACTS.CONTRACT_LIST[chain][network][SWAP];
          setApproveError(false);
          if (await isApprovedForAll(network, address, contractAddress)) {
            setApproved(true);
          } else {
            setApproving(true);
            const config = await setApprovalForAll(network, contractAddress);
            const res = await writeContract(config);
            await res.wait();
            setApproved(true);
            setApproving(false);
          }
        } catch (e) {
          console.error(e);
          setApproving(false);
          setApproveError(true);
          setFinished(true);
          return;
        }
      } else {
        setApproved(true);
      }

      try {
        const txid = await swapRouter.removeLiquidity(
          chain,
          network,
          tokenId,
          connectedWallet
        );

        setTxid(txid);
        setSubmitting(true);
        await waitTransactionUntilSubmmited(chain, network, txid);
        setSubmitting(false);
        setFinished(true);
      } catch (e) {
        setSubmitting(false);
        setSubmitError(true);
        console.error(e);
      }
    };

    doAction();
  }, []);

  return (
    <Modal onClose={onCancel}>
      <div className="">
        <div className="block">
          <h3 className="title is-5 has-text-centered">Withdraw LP Tokens</h3>
        </div>
        <div className="block">
          <Steps
            progressDot={true}
            current={currentStep}
            items={[
              {
                title: "Tranfsfer approval",
                description: (
                  <>
                    {isApproving ? (
                      <LoadingWithText title="Approving" />
                    ) : (
                      <></>
                    )}
                    {isApproved ? "Approved" : ""}
                    {approveError ? (
                      <span className="has-text-danger">Error</span>
                    ) : (
                      ""
                    )}
                  </>
                )
              },
              {
                title: "Action",
                description: (
                  <>
                    {isSubmitting ? (
                      <LoadingWithText title="Submitting" />
                    ) : (
                      <></>
                    )}
                    {isFinished ? "Finished" : ""}
                    {submitError ? (
                      <span className="has-text-danger">Error</span>
                    ) : (
                      ""
                    )}
                  </>
                )
              }
            ]}
          />
        </div>

        {isFinished ? (
          <>
            <hr />
            <div className="buttons" style={{ justifyContent: "center" }}>
              {txid ? (
                <a
                  className="button is-primary"
                  target="_blank"
                  href={`${getExploler(chain, network)}/${txid}`}
                  rel="noreferrer"
                >
                  View txid on explorer
                </a>
              ) : (
                <></>
              )}

              <button onClick={onSuccess} className="button is-black">
                Close
              </button>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </Modal>
  );
};

export default RemoveLiquidityModal;
