export const getWalletIcon = (key: string) => {
  let svg = "";
  switch (key) {
    case "metaMask":
      svg = "/icons/metamask.png";
      break;
    case "":
      svg = "/icons/coinbase.png";
      break;
  }
  return svg;
};
