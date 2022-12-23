import {META_MASK} from "../../../eth/consts";

export const getWalletIcon = (key: string) => {
  let svg = "";
  switch (key) {
    case META_MASK:
      svg = "/icons/metamask.png";
      break;
  }
  return svg;
};
