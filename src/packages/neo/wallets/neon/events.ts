import { consts } from ".";

export const addEventListenerNeonWalletDisconnected = (
  callback: () => void
) => {
  window.addEventListener(consts.NEON_WALLET_DISCONNECTED, callback, false);
};

export const removeEventListenerNeonWalletDisconnected = (
  callback: () => void
) => {
  window.removeEventListener(consts.NEON_WALLET_DISCONNECTED, callback, false);
};

export const dispatchEventNeonWalletDisconnected = () => {
  console.log("disconnected");
  window.dispatchEvent(new CustomEvent(consts.NEON_WALLET_DISCONNECTED));
};
