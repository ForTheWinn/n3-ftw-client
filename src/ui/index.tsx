import { WagmiProvider } from "wagmi";
import { HashRouter as Router } from "react-router-dom";

import { NeoWalletProvider } from "../common/hooks/use-neo-wallets";
import { AppContextProvider } from "../common/hooks/use-app";

import Header from "./components/Commons/Header/Header";
import WalletSidebar from "./components/Commons/SideNavs/WalletSidebar";
import MobileMenuSlider from "./components/Commons/SideNavs/MobileMenuSlider";
import TxHandler from "./components/Commons/TxHandler";
import Routes from "./Routes";
import { ConfigProvider } from "antd";
import { wagmiConfig as config } from "../wagmi-config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ANTD_THEME } from "../consts/antd-config";
const queryClient = new QueryClient();
const App = () => {
  return (
    <ConfigProvider theme={ANTD_THEME}>
      <AppContextProvider>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <NeoWalletProvider>
              <Router>
                <Header />
                <Routes />
                <MobileMenuSlider />
                <WalletSidebar />
                <TxHandler />
              </Router>
            </NeoWalletProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </AppContextProvider>
    </ConfigProvider>
  );
};

export default App;
