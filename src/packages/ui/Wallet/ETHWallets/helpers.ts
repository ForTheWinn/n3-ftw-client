import { COINBASE_WALLET, META_MASK } from "../../../web3/consts";

export const getWalletIcon = (key: string) => {
  let svg = "";
  switch (key) {
    case META_MASK:
      svg = "/icons/metamask.png";
      break;
    case COINBASE_WALLET:
      svg = "/icons/coinbase.png";
      break;
  }
  return svg;
};
