import React, { useEffect, useState } from "react";
import {
  readContract,
  erc20ABI,
  prepareWriteContract,
  writeContract,
  waitForTransaction
} from "@wagmi/core";
import { Button, Result, Steps } from "antd";
import { ethers } from "ethers";
import { CHAINS } from "../../../../../../../consts/chains";
import { ITokenMetadata } from "./EVM";
import Modal from "../../../../../../components/Modal";
import LoadingWithText from "../../../../../../components/Commons/LoadingWithText";
import {
  CONTRACT_LIST,
  NEP_CONTRACT_HASH
} from "../../../../../../../consts/contracts";
import { INetworkType } from "../../../../../../../packages/neo/network";
import { SMITH } from "../../../../../../../consts/global";
import { SMITH_FEE } from "../../../../../../../consts/smith";
import {
  createTokenContract,
  getContractHashFromLogs
} from "../../../../../../../packages/polygon/contracts/smith";
import { getExplorer } from "../../../../../../../helpers/helpers";

interface IActionModalProps extends ITokenMetadata {
  chain: CHAINS;
  network: INetworkType;
  address: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const ActionModal = ({
  chain,
  network,
  address,
  name,
  symbol,
  totalSupply,
  decimals,
  website,
  icon,
  onSuccess,
  onCancel
}: IActionModalProps) => {
  const feeTokenContractHash = NEP_CONTRACT_HASH[chain][network];
  const smithTokenContractHash = CONTRACT_LIST[chain][network][SMITH];
  const [isFeeTokenApproved, setFeeTokenApproved] = useState(false);
  const [isFeeTokenApproving, setFeeTokenApproving] = useState(false);
  const [hasFeeTokenApproveError, setFeeTokenApproveError] = useState(false);

  const [contractHash, setContractHash] = useState();
  const [isMinting, setMinting] = useState(false);
  const [isMinted, setMinted] = useState(false);
  const [hasMintError, setMintError] = useState(false);

  let currentStep = 0;

  if (isFeeTokenApproved) {
    currentStep = 1;
  }
  if (isMinted) {
    currentStep = 2;
  }

  useEffect(() => {
    async function start() {
      try {
        setFeeTokenApproving(true);
        const approvedAmount: any = await readContract({
          address: feeTokenContractHash as any,
          abi: erc20ABI,
          functionName: "allowance",
          args: [address as any, smithTokenContractHash as any]
        });

        if (approvedAmount.gte(SMITH_FEE[chain][network])) {
          setFeeTokenApproved(true);
          setFeeTokenApproving(false);
        } else {
          const script = await prepareWriteContract({
            address: feeTokenContractHash as any,
            abi: erc20ABI,
            functionName: "approve",
            args: [
              smithTokenContractHash as any,
              ethers.constants.MaxUint256 as any
            ]
          });

          const { hash } = await writeContract(script);
          await waitForTransaction({ hash });
          setFeeTokenApproved(true);
          setFeeTokenApproving(false);
        }
      } catch (e) {
        console.error(e);
        setFeeTokenApproving(false);
        setFeeTokenApproveError(true);
      }

      try {
        setMinting(true);
        const script = await createTokenContract(
          chain,
          network,
          name,
          symbol,
          totalSupply,
          decimals,
          website,
          icon
        );
        const txid = await writeContract(script);
        const data = await waitForTransaction(txid);
        const contractHash = getContractHashFromLogs(data.logs);
        setContractHash(contractHash);

        setMinted(true);
        setMinting(false);
      } catch (e: any) {
        console.error(e);
        setMintError(true);
        setMinting(false);
      }
    }

    start();
  }, []);

  return (
    <Modal onClose={onCancel}>
      <>
        {contractHash ? (
          <Result
            status="success"
            title="Successfully deployed your token contract!"
            subTitle={`contract hash: ${contractHash}`}
            extra={[
              <Button
                target="_blank"
                href={`${getExplorer(
                  chain,
                  network,
                  "contract"
                )}/${contractHash}`}
                type="primary"
                key="console"
              >
                Detilas
              </Button>,
              <Button onClick={onSuccess} key="close">
                Close
              </Button>
            ]}
          />
        ) : (
          <div>
            <h3 className="title is-5 has-text-centered">New token contract</h3>
            <Steps
              progressDot={true}
              current={currentStep}
              items={[
                {
                  title: "Fee token approval",
                  description: (
                    <>
                      {isFeeTokenApproving ? (
                        <LoadingWithText title="Approving" />
                      ) : (
                        <></>
                      )}
                      {isFeeTokenApproved ? "Approved" : ""}
                      {hasFeeTokenApproveError ? (
                        <span className="has-text-danger">Error</span>
                      ) : (
                        ""
                      )}
                    </>
                  )
                },
                {
                  title: "Deploy",
                  description: (
                    <>
                      {isMinting ? (
                        <LoadingWithText title="Deploying" />
                      ) : (
                        <></>
                      )}
                      {isMinted ? "Deployed" : ""}
                      {hasMintError ? (
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
        )}
      </>
    </Modal>
  );
};

export default ActionModal;
