import React, { useState, useEffect, useRef } from "react";
import { wallet } from "@cityofzion/neon-core";
import { IBridgeChain } from "../../../../../common/routers/bridge/interfaces";
import { IBridgeReceiver } from "../../interfaces";
import { ethers } from "ethers";

interface IWalletInputProps {
  chain: IBridgeChain;
  value: IBridgeReceiver;
  onChange: (v: IBridgeReceiver) => void;
}
const WalletInput = ({ chain, value, onChange }: IWalletInputProps) => {
  const [hasError, setError] = useState(false);
  const [inputValue, setInputValue] = useState(value.address);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      let isValid;
      setError(false);
      if (inputValue.trim() === "") {
        // if input is empty
        isValid = false;
      } else if (chain.chainId === 888 || chain.chainId === 889) {
        isValid = wallet.isAddress(inputValue);
      } else {
        isValid = ethers.utils.isAddress(inputValue);
      }
      if (!inputValue) {
        setError(false);
      } else {
        if (!isValid) {
          setError(true);
        }
      }

      onChange({
        address: inputValue,
        isValid
      });
    }, 1000);
  }, [inputValue]);

  const handleChange = (_value: string) => {
    setInputValue(_value);
  };

  return (
    <div className="box is-shadowless mb-0">
      <input
        style={!hasError ? { border: 0 } : {}}
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={`${chain.name} wallet address`}
        className={`input is-shadowless ${hasError ? "is-danger" : ""}`}
      />
    </div>
  );
};

export default WalletInput;
