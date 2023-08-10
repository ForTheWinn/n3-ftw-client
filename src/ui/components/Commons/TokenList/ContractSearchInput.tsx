import React, { useRef, useState } from "react";
import { fetchToken } from "@wagmi/core";
import { FaAngleLeft } from "react-icons/fa";
import { ITokenState } from "../../../pages/Swap/scenes/Swap/interfaces";
import { ethers } from "ethers";
import { WENT_WRONG } from "../../../../consts/messages";
import { globalRouter } from "../../../../common/routers";
import { CHAINS } from "../../../../consts/chains";
import { INetworkType } from "../../../../packages/neo/network";

interface ContractSearchInputProps {
  chain: CHAINS;
  network: INetworkType;
  onAssetClick: (token: ITokenState) => void;
  filterDecimals?: boolean; // This to know use of swap or locker
}
const ContractSearchInput = ({
  onAssetClick,
  chain,
  network
}: ContractSearchInputProps) => {
  const [customContractHash, setContractHash] = useState("");
  const [contractInfo, setContractInfo] = useState<ITokenState | undefined>();
  const [error, setError] = useState<string | undefined>();

  const onAddContractHash = async () => {
    setError(undefined);

    if (ethers.isAddress(customContractHash)) {
      try {
        const token = await globalRouter.fetchTokenInfo(
          chain,
          network,
          customContractHash
        );
        setContractInfo({
          hash: customContractHash,
          decimals: token.decimals,
          symbol: token.symbol,
          icon: ""
        });
      } catch (e: any) {
        setError(e.message ? e.message : WENT_WRONG);
      }
    } else {
      setError("Please enter a valid contract script hash.");
    }
  };

  const handleSubmit = () => {
    if (contractInfo) {
      onAssetClick(contractInfo);
    }
  };

  return (
    <>
      {contractInfo ? (
        <>
          <h1 className="title is-5 is-marginless">We've found the contract</h1>
          <hr />

          <div className="columns is-multiline">
            <div className="column is-12">
              <strong>Contract Hash</strong>
              <p>{contractInfo.hash}</p>
            </div>
            <div className="column is-6">
              <strong>Symbol</strong>
              <p>{contractInfo.symbol}</p>
            </div>
            <div className="column is-6">
              <strong>Decimals</strong>
              <p>{contractInfo.decimals}</p>
            </div>
            <div className="column is-12">
              <strong>Note!</strong>
              <p>
                Invoking unverified contract is extremely dangerous. Please
                check the contract hash again.
              </p>
            </div>
          </div>
          <hr />
          <div className="level">
            <div className="level-left">
              <div className="level-item">
                <button
                  onClick={() => setContractInfo(undefined)}
                  className="button is-light"
                >
                  <FaAngleLeft />
                  Back
                </button>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                <button onClick={handleSubmit} className="button is-primary">
                  Ok
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className="title is-5">Enter a contract hash</h1>
          <p className="subtitle is-7 has-text-grey">
            Example: 0xf853a98ac55a756ae42379a312d55ddfdf7c8514
          </p>
          <hr />
          <div className="field">
            <input
              placeholder={"0x..."}
              className="input"
              value={customContractHash}
              onChange={(e) => setContractHash(e.target.value)}
            />
            {error && <p className="help is-danger">{error}</p>}
          </div>
          <hr />
          <button
            onClick={onAddContractHash}
            disabled={!customContractHash}
            className="button is-primary"
          >
            Submit
          </button>
        </>
      )}
    </>
  );
};

export default ContractSearchInput;
