import React, { useEffect, useRef, useState } from "react";
import { wallet } from "@cityofzion/neon-core";
import { DaoContract } from "../../../../../packages/neo/contracts/ftw/dao";
import { INetworkType } from "../../../../../packages/neo/network";
import { IConnectedWallet } from "../../../../../packages/neo/wallets/interfaces";
import ConnectWalletButton from "../../../../components/ConnectWalletButton";

interface IVerifyContractProps {
  network: INetworkType;
  connectedWallet?: IConnectedWallet;
  onVerify: (contractHash: string, symbol: string, decimals: string) => void;
}
const VerifyContract = ({
  network,
  connectedWallet,
  onVerify
}: IVerifyContractProps) => {
  const [contractHash, setContractHash] = useState("");
  const [error, setError] = useState<string | undefined>();
  const handleVerify = async () => {
    setError(undefined);
    let hash = contractHash;
    const ox = contractHash.substring(0, 2);
    if (ox === "0x") {
      hash = contractHash.substring(2);
    }
    if (wallet.isScriptHash(hash)) {
      if (connectedWallet) {
        const { hasPermission, symbol, decimals } = await new DaoContract(
          network
        ).hasPermission(connectedWallet, contractHash);
        if (hasPermission) {
          // Verified
          onVerify(contractHash, symbol, decimals);
        } else {
          setError(
            "We couldn't find your permission to create a channel. Please contract FTW team if you have a permission."
          );
        }
      }
    } else {
      setError("Please enter a valid contract script hash.");
    }
  };

  const firstInput = useRef(null);

  useEffect(() => {
    // @ts-ignore
    firstInput.current.focus();
  }, []);
  return (
    <div>
      <div className="field">
        <label className="label">Contract Hash</label>
        <div className="control">
          <input
            placeholder="0x.."
            ref={firstInput}
            value={contractHash}
            onChange={(e) => setContractHash(e.target.value)}
            className="input"
            type="text"
          />
          {error && <p className="help is-danger">{error}</p>}
        </div>
      </div>
      {connectedWallet ? (
        <button
          disabled={!contractHash}
          onClick={handleVerify}
          className="button is-primary"
        >
          Verify
        </button>
      ) : (
        <ConnectWalletButton />
      )}
    </div>
  );
};

export default VerifyContract;
