import React, { useRef, useState } from "react";
import { wallet } from "@cityofzion/neon-core";
import { FaAngleLeft, FaAngleRight, FaQuestionCircle } from "react-icons/fa";
import { GetContractStateResult } from "@cityofzion/neon-core/lib/rpc/Query";
import { ITokenState } from "../../interfaces";

interface ContractSearchInputProps {
  onAssetClick: (token: ITokenState) => void;
  filterDecimals?: boolean; // This to know use of swap or locker
}
const ContractSearchInput = ({
  onAssetClick,
  filterDecimals,
}: ContractSearchInputProps) => {
  const [customContractHash, setContractHash] = useState("");
  const [contractInfo, setContractInfo] = useState<ITokenState | undefined>();
  const [contractState, setContractState] = useState<
    GetContractStateResult | undefined
  >();
  const [error, setError] = useState<string | undefined>();
  const firstInput = useRef(null);

  const onAddContractHash = async () => {
    // setError(undefined);
    // let hash = customContractHash;
    // const ox = customContractHash.substring(0, 2);
    // if (ox === "0x") {
    //   hash = customContractHash.substring(2);
    // }
    // if (wallet.isScriptHash(hash)) {
    //   try {
    //     const res = await new SwapContract(network).getContractInfo(hash);
    //     const state = await Network.getContactState(network, hash);
    //     if (res.decimals === 0 && filterDecimals) {
    //       setError(`FTWSwap cannot support tokens with 0 decimals.`);
    //     } else {
    //       setContractInfo(res);
    //       setContractState(state);
    //       // onAssetClick(hash, symbol, decimals);
    //     }
    //   } catch (e: any) {
    //     setError(e.message);
    //   }
    // } else {
    //   setError("Please enter a valid contract script hash.");
    // }
  };

  // const handleSubmit = () => {
  //   if (contractInfo) {
  //     onAssetClick(
  //       contractInfo.contractHash,
  //       contractInfo.symbol,
  //       contractInfo.decimals
  //     );
  //   }
  // };
  //
  // useEffect(() => {
  //   // @ts-ignore
  //   firstInput.current.focus();
  // }, []);

  return (
    <>
      {contractInfo && contractState ? (
        <>
          <h1 className="title is-5 is-marginless">We've found the contract</h1>
          <hr />

          <div className="columns is-multiline">
            <div className="column is-12">
              <strong>Contract Name</strong>
              <p>{contractState.manifest.name}</p>
            </div>
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
            <div className="column is-6">
              <strong>FTWSmith verification</strong>
              <div className="dropdown is-up is-hoverable ml-2">
                <div className="dropdown-trigger">
                  <span className="icon is-small">
                    <FaQuestionCircle />
                  </span>
                </div>
                <div className="dropdown-menu" id="dropdown-menu7" role="menu">
                  <div className="dropdown-content">
                    <div className="dropdown-item">
                      FTWSmith NEP17 is open sourced and don't have update
                      function.
                    </div>
                  </div>
                </div>
              </div>
              <p
                // className={
                //   contractInfo.isWhitelisted
                //     ? "has-text-info"
                //     : "has-text-danger"
                // }
              >
                {/* {contractInfo.isWhitelisted ? "Yes" : "No"} */}
              </p>
            </div>
            <div className="column is-6">
              <strong>Update counter</strong>
              <div className="dropdown is-up is-hoverable ml-2">
                <div className="dropdown-trigger">
                  <span className="icon is-small">
                    <FaQuestionCircle />
                  </span>
                </div>
                <div className="dropdown-menu" id="dropdown-menu7" role="menu">
                  <div className="dropdown-content">
                    <div className="dropdown-item">
                      This indicates how many times this contract has been
                      updated since deploy.
                    </div>
                  </div>
                </div>
              </div>
              <br />
              {contractState.updatecounter}
            </div>
            <div className="column is-12">
              <strong>Note!</strong>
              <p>
                Invoking unverified contract is extremely dangerous. Please
                check the contract hash again.{" "}
              </p>
            </div>
          </div>
          <hr />
          <div className="buttons">
            <button
              onClick={() => setContractInfo(undefined)}
              className="button is-light"
            >
              <FaAngleLeft />
              Back
            </button>
            {/* <button onClick={handleSubmit} className="button is-primary">
              <span>Next</span>
              <FaAngleRight />
            </button> */}
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
              ref={firstInput}
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
