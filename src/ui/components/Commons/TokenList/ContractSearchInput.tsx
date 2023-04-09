import React, { useRef, useState } from "react";
import { fetchToken } from "@wagmi/core";
import { FaAngleLeft } from "react-icons/fa";
import { ITokenState } from "../../../pages/Swap/scenes/Swap/interfaces";
import { ethers } from "ethers";
import { WENT_WRONG } from "../../../../consts/messages";

interface ContractSearchInputProps {
  onAssetClick: (token: ITokenState) => void;
  filterDecimals?: boolean; // This to know use of swap or locker
}
const ContractSearchInput = ({
  onAssetClick,
  filterDecimals
}: ContractSearchInputProps) => {
  const [customContractHash, setContractHash] = useState("");
  const [contractInfo, setContractInfo] = useState<ITokenState | undefined>();
  const [error, setError] = useState<string | undefined>();

  const onAddContractHash = async () => {
    setError(undefined);

    if (ethers.utils.isAddress(customContractHash)) {
      try {
        const token = await fetchToken({
          address: customContractHash as any
        });
        setContractInfo({
          hash: token.address,
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
              <p>0x{contractInfo.hash}</p>
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
            Example: 0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5
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
