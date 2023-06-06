import React from "react";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { publicProvider } from "wagmi/providers/public";
import { HashRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { NeoWalletProvider } from "../common/hooks/use-neo-wallets";
import { AppContextProvider } from "../common/hooks/use-app";

import Header from "./components/Commons/Header/Header";
import WalletSidebar from "./components/Commons/SideNavs/WalletSidebar";
import MobileMenuSlider from "./components/Commons/SideNavs/MobileMenuSlider";
import TxHandler from "./components/Commons/TxHandler";
import Routes from "./Routes";
import { TESTNET } from "../consts/global";

const { chains, provider, webSocketProvider } = configureChains(
  [process.env.REACT_APP_NETWORK === TESTNET ? polygonMumbai : polygon],
  [
    // alchemyProvider({
    //   apiKey: process.env.REACT_APP_ALCHEMY_API_KEY
    //     ? process.env.REACT_APP_ALCHEMY_API_KEY
    //     : "",
    //   priority: 0
    // }),
    publicProvider()
  ]
);

const client = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  provider,
  webSocketProvider
});

const App = () => {
  return (
    <AppContextProvider>
      <WagmiConfig client={client}>
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
