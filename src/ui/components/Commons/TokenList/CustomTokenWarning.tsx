import React from "react";
import { IToken } from "../../../../consts/tokens";
import { CHAINS } from "../../../../consts/chains";
import { INetworkType } from "../../../../packages/neo/network";
import { getExplorer } from "../../../../common/helpers";

interface ICustomTokenWarningProps {
  chain: CHAINS;
  network: INetworkType;
  token: IToken;
  onOk: (token: IToken) => void;
  onCancel: () => void;
}
const CustomTokenWarning = ({
  token,
  chain,
  network,
  onOk,
  onCancel,
}: ICustomTokenWarningProps) => {
  const explorerLink = `${getExplorer(chain, network, "contract")}/${token.hash}`;
  return (
    <div className="has-text-centered p-5">
      <div className="notification is-warning is-light is-small">
        <p>Invoking unverified contract is dangerous</p>
        <br />
        <a
          target="_blank"
          href={explorerLink}
          className="button is-small is-white"
          rel="noreferrer"
        >
          View token details
        </a>
      </div>
      <div className="content is-small">
        <h6>Symbol</h6>
        <p>{token.symbol}</p>
        <h6>Decimals</h6>
        <p>{token.decimals}</p>
      </div>
      <div className="columns is-mobile">
        <div className="column">
          <button
            onClick={() => onOk(token)}
            className="button is-success is-fullwidth"
          >
            I Understand
          </button>
        </div>
        <div className="column">
          <button onClick={onCancel} className="button is-light  is-fullwidth">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomTokenWarning;
