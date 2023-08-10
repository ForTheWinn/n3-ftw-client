import React, { useState, useEffect, useRef } from "react";
import { wallet } from "@cityofzion/neon-core";
import { IBridgeChain } from "../../../../../common/routers/bridge/interfaces";
import { IBridgeReceiver } from "../../interfaces";
import { ethers } from "ethers";
import { INetworkType, Network } from "../../../../../packages/neo/network";
import { NEO_MAINNET_CHAIN_ID, NEO_TESTNET_CHAIN_ID } from "../../../../../consts/global";

interface IWalletInputProps {
  chain: IBridgeChain;
  network: INetworkType;
  value: IBridgeReceiver;
  onChange: (v: IBridgeReceiver) => void;
}
const WalletInput = ({
  chain,
  network,
  value,
  onChange,
}: IWalletInputProps) => {
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(value.address);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(async () => {
      let isValid;
      setError(undefined);
      if (inputValue.trim() === "") {
        isValid = false;
      } else if (chain.chainId === NEO_MAINNET_CHAIN_ID || chain.chainId === NEO_TESTNET_CHAIN_ID) {
        isValid = wallet.isAddress(inputValue);
        if (isValid) {
          try {
            const res = await Network.getContactState(
              network,
              wallet.getScriptHashFromAddress(inputValue)
            );
            if (res) {
              isValid = false;
              setError("Receiver cannot be a smart contract address");
            }
          } catch (e) {
            isValid = true;
          }
        } else {
          setError("Wallet address is invalid");
        }
      } else {
        isValid = ethers.isAddress(inputValue);
        if (!isValid) {
          setError("Wallet address is invalid");
        }
      }
      setLoading(false);
      onChange({
        address: inputValue,
        isValid,
      });
    }, 1000);
  }, [inputValue]);

  const handleChange = (_value: string) => {
    setLoading(true);
    setInputValue(_value);
  };

  return (
    <div className="box is-shadowless mb-0">
      <div className={`control ${isLoading ? "is-loading" : ""}`}>
        <input
          style={error ? {} : { border: 0 }}
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={`${chain.name} wallet address`}
          className={`input is-shadowless ${error ? "is-danger" : ""}`}
        />
        {error && <p className="help is-danger">{error}</p>}
      </div>
    </div>
  );
};

export default WalletInput;
