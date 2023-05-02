import React from "react";

interface ISwapButtonProps {
  isLoading: boolean;
  isWalletConnected: boolean;
  isActive?: boolean;
  onClick: () => void;
  label: string;
}
const SwapButton = ({
  label,
  isLoading,
  isWalletConnected,
  isActive,
  onClick,
}: ISwapButtonProps) => {
  return (
    <button
      disabled={!isActive}
      onClick={onClick}
      className={`button is-fullwidth is-large is-primary mt-2 ${
        isLoading ? "is-loading" : ""
      }`}
    >
      {isWalletConnected ? label : "Connect wallet"}
    </button>
  );
};

export default SwapButton;
