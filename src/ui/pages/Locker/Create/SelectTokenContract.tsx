import React from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import AssetListModal from "../../Swap/scenes/Swap/NEO/TokenList";
import { ITokenState } from "../../Swap/scenes/Swap/interfaces";
import { IContractState } from "./index";

interface ISelectTokenContractProps {
  contract?: IContractState;
  onContractChange: (contract: IContractState | undefined) => void;
}
const SelectTokenContract = ({
  contract,
  onContractChange,
}: ISelectTokenContractProps) => {
  const [isModalActive, setModalActive] = React.useState(false);
  return (
    <div className="field">
      <label className="label">Token contract hash</label>
      {contract ? (
        <div>
          <div className="level">
            <div className="level-left">
              <div className="level-item">
                {`${contract.symbol} - 0x${contract.assetHash}`}
              </div>
              <div className="level-item">
                <button
                  onClick={() => onContractChange(undefined)}
                  className="button is-small is-light"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="control">
          <button
            onClick={() => setModalActive(true)}
            className="button is-black"
          >
            <span className="icon">
              <FaPlus />
            </span>
            <span>Select a token</span>
          </button>
        </div>
      )}

      {isModalActive ? (
        <AssetListModal
          activeTokenInput={"A"}
          tokenAHash={undefined}
          tokenBHash={undefined}
          onAssetClick={(token: ITokenState) => {
            onContractChange({
              assetHash: token.hash,
              symbol: token.symbol,
              decimals: token.decimals,
            });
            setModalActive(false);
          }}
          onClose={() => setModalActive(false)}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default SelectTokenContract;
