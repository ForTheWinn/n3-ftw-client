import React, { useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import { IToken } from "../../../../consts/tokens";
import { ethers } from "ethers";
import { TOKEN_FETCH_ERROR, WENT_WRONG } from "../../../../consts/messages";
import { CHAINS } from "../../../../consts/chains";
import { INetworkType } from "../../../../packages/neo/network";
import { fetchTokenInfo } from "../../../../common/routers/global";

interface ContractSearchInputProps {
  chain: CHAINS;
  network: INetworkType;
  onAssetClick: (token: IToken) => void;
  filterDecimals?: boolean; // This to know use of swap or locker
}
const ContractSearchInput = ({
  onAssetClick,
  chain,
  network,
}: ContractSearchInputProps) => {
  const [customContractHash, setContractHash] = useState("");
  const [contractInfo, setContractInfo] = useState<IToken | undefined>();
  const [error, setError] = useState<string | undefined>();

  const onAddContractHash = async () => {
    setError(undefined);

    if (ethers.isAddress(customContractHash)) {
      const token = await fetchTokenInfo(chain, network, customContractHash);
      if (token) {
        setContractInfo({
          hash: customContractHash,
          decimals: token.decimals,
          symbol: token.symbol,
          icon: "",
        });
      } else {
        setError(TOKEN_FETCH_ERROR);
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
