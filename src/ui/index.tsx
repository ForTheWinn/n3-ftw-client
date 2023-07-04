import { polygon, polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

import { WagmiConfig, configureChains, createConfig } from "wagmi";
// import { publicProvider } from "@wagmi/core/providers/public";

import { HashRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { NeoWalletProvider } from "../common/hooks/use-neo-wallets";
import { AppContextProvider } from "../common/hooks/use-app";
import { TESTNET } from "../consts/global";

import Header from "./components/Commons/Header/Header";
import WalletSidebar from "./components/Commons/SideNavs/WalletSidebar";
import MobileMenuSlider from "./components/Commons/SideNavs/MobileMenuSlider";
import TxHandler from "./components/Commons/TxHandler";
import Routes from "./Routes";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [process.env.REACT_APP_NETWORK === TESTNET ? polygonMumbai : polygon],
  [
    alchemyProvider({
      apiKey:
        process.env.REACT_APP_NETWORK === TESTNET
          ? (process.env.REACT_APP_ALCHEMY_POLYGON_TESTNET_API_KEY as string)
          : (process.env.REACT_APP_ALCHEMY_POLYGON_MAINNET_API_KEY as string),
    }),
  ]
);

const config = createConfig({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  publicClient,
  webSocketPublicClient,
});

const App = () => {
  return (
    <AppContextProvider>
      <WagmiConfig config={config as any}>
        <NeoWalletProvider>
          <Router>
            <Toaster position="bottom-center" />
            <Header />
            <Routes />
            <MobileMenuSlider />
            <WalletSidebar />
            <TxHandler />
          </Router>
        </NeoWalletProvider>
      </WagmiConfig>
    </AppContextProvider>
  );
};

export default App;
