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
  if (!isWalletConnected) {
    return (
      <button
        onClick={onClick}
        className={`button is-fullwidth is-primary mt-1 is-large`}
      >
        Connect wallet
      </button>
    );
  }
  return (
    <button
      disabled={!isActive}
      onClick={onClick}
      className={`button is-fullwidth is-primary mt-1 is-large ${
        isLoading ? "is-loading" : ""
      }`}
    >
      {label}
    </button>
  );
};

export default SwapButton;
