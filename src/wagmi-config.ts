import { base, mainnet, polygon, polygonMumbai } from "wagmi/chains";
import { http, createConfig } from "wagmi";
import { NEOX_MAINNET_CHAIN_DETAIL } from "./consts/chains";

export const wagmiConfig = createConfig({
  chains: [NEOX_MAINNET_CHAIN_DETAIL, mainnet, polygon, polygonMumbai, base],
  connectors: [],
  transports: {
    [mainnet.id]: http(
      `https://eth-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_POLYGON_MAINNET_API_KEY}`
    ),
    [polygon.id]: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_POLYGON_MAINNET_API_KEY}`
    ),
    [polygonMumbai.id]: http(
      `https://polygon-mumbai.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_POLYGON_TESTNET_API_KEY}`
    ),
    [base.id]: http(base.rpcUrls.default.http[0]),
    [NEOX_MAINNET_CHAIN_DETAIL.id]: http("https://neoxseed1.ngd.network"),
  },
});
