import React from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import TokenList from "../../../components/Commons/TokenList";
import { useApp } from "../../../../common/hooks/use-app";
import { ITokenState } from "../../Swap/scenes/Swap/interfaces";

interface ISelectTokenContractProps {
  contract?: ITokenState;
  onContractChange: (contract: ITokenState | undefined) => void;
}
const SelectTokenContract = ({
  contract,
  onContractChange
}: ISelectTokenContractProps) => {
  const { chain, network } = useApp();
  const [isModalActive, setModalActive] = React.useState(false);
  return (
    <div className="field">
      <label className="label">Token</label>
      {contract ? (
        <div>
          <div className="level">
            <div className="level-left">
              <div className="level-item">
                {`${contract.symbol} - ${contract.hash}`}
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
            className="button is-dark"
          >
            <span className="icon">
              <FaPlus />
            </span>
            <span>Select a token</span>
          </button>
        </div>
      )}

      {isModalActive ? (
        <TokenList
          chain={chain}
          network={network}
          activeTokenInput={"A"}
          tokenAHash={undefined}
          tokenBHash={undefined}
          onAssetClick={(token: ITokenState) => {
            onContractChange(token);
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
