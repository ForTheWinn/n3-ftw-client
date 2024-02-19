import { WagmiProvider } from "wagmi";
import { HashRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";

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
const queryClient = new QueryClient();
const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#rgba(0, 0, 0, 1)",
          colorLink: "#rgba(0, 0, 0, 1)",
        },
        components: {
          Menu: {
            activeBarBorderWidth: 0,
            itemSelectedBg: "white",
          },
        },
      }}
    >
      <AppContextProvider>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
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
          </QueryClientProvider>
        </WagmiProvider>
      </AppContextProvider>
    </ConfigProvider>
  );
};

export default App;
