import React, { createContext, useContext, useEffect, useState } from "react";
import { useApp } from "../../../../../common/hooks/use-app";
import { CHAINS, CONFIGS } from "../../../../../consts/chains";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import { INetworkType } from "../../../../../packages/neo/network";
import { useWalletRouter } from "../../../../../common/hooks/use-wallet-router";
import BridgeChainList from "./components/BridgeChainList";
import TokenList from "./components/TokenList";
import { toast } from "react-hot-toast";
import { IBridgeReceiver, IBridgeSelectedtoken } from "../../interfaces";
import { globalRouter } from "../../../../../common/routers";
import { BRIDGE_CHAINS } from "../../../../../consts/bridge";
import { IBridgeChain } from "../../../../../common/routers/bridge/interfaces";
import { IConnectedWallet } from "../../../../../packages/neo/wallets/interfaces";
import { NEO_CHAIN } from "../../../../../consts/global";

interface IBridgeContext {
  chain: CHAINS;
  network: INetworkType;
  originChain: IBridgeChain | undefined;
  destChain: IBridgeChain | undefined;
  token: IBridgeSelectedtoken | undefined;
  amount: string | undefined;
  receiver: IBridgeReceiver;
  balance?: string;
  connectedAddress?: string;
  connectedNeoWallet?: IConnectedWallet;
  isActionModaActive: boolean;
  setReceiver: (v: IBridgeReceiver) => void;
  setToken: (token: IBridgeSelectedtoken | undefined) => void;
  setAmount: (amount: string | undefined) => void;
  setChainSelectModalActive: (v: "A" | "B" | undefined) => void;
  openBridgeTokenList: () => void;
  toggleWalletSidebar: () => void;
  setActionModalActive: (v: boolean) => void;
  onAfterBridgeCompleted: () => void;
}

export const SwapContext = createContext({} as IBridgeContext);

export const SwapContextProvider = (props: { children: any }) => {
  const {
    chain,
    network,
    refreshCount,
    toggleWalletSidebar,
    increaseRefreshCount
  } = useApp();
  const { connectedWallet } = useNeoWallets();
  const { address } = useWalletRouter(chain);

  const [originChain, setOriginChain] = useState<IBridgeChain | undefined>(
    BRIDGE_CHAINS[network][CONFIGS[network][chain].chainId]
  );
  const [destChain, setDestChain] = useState<IBridgeChain | undefined>();

  const [token, setToken] = useState<IBridgeSelectedtoken | undefined>();
  const [amount, setAmount] = useState<string | undefined>();
  const [receiver, setReceiver] = useState<IBridgeReceiver>({
    address: "",
    isValid: false
  });
  const [balance, setBalance] = useState<string | undefined>();

  const [isAssetChangeModalActive, setAssetChangeModalActive] = useState(false);

  const [isActionModaActive, setActionModalActive] = useState(false);

  const [isChainSelectModalActive, setChainSelectModalActive] = useState<
    "A" | "B" | undefined
  >();

  // This is used in TokenList when users select a token.
  const onAssetClick = (token: IBridgeSelectedtoken) => {
    // setAmount(undefined);
    setToken(token);
    setAssetChangeModalActive(false);
  };

  const onChainClick = (chain: IBridgeChain) => {
    if (isChainSelectModalActive === "A") {
      if (destChain && destChain.chainId === chain.chainId) {
        setDestChain(undefined);
      }
      setOriginChain(chain);
    } else {
      if (originChain && originChain.chainId === chain.chainId) {
        setOriginChain(undefined);
      }
      setDestChain(chain);
    }
    setChainSelectModalActive(undefined);
  };

  const openBridgeTokenList = () => {
    if (originChain && destChain) {
      setAssetChangeModalActive(true);
    } else {
      toast.error("Select chains first.");
    }
  };

  const onAfterBridgeCompleted = () => {
    setAmount(undefined);
    increaseRefreshCount();
  };

  let connectedAddress =
    chain === NEO_CHAIN ? connectedWallet?.account.address : address;

  useEffect(() => {
    const loadBalance = async (_tokenHash, _address) => {
      try {
        const _balance = await globalRouter.fetchTokenBalance(
          chain,
          network,
          _address,
          _tokenHash
        );
        setBalance(_balance);
      } catch (e) {
        console.error(e);
      }
    };
    if (token && connectedAddress) {
      loadBalance(token.hash, connectedAddress);
    }
  }, [token, connectedAddress, refreshCount]);

  const contextValue = {
    chain,
    network,
    token,
    originChain,
    destChain,
    amount,
    receiver,
    balance,
    connectedAddress,
    connectedNeoWallet: connectedWallet,
    isActionModaActive,
    setReceiver,
    setActionModalActive,
    setToken,
    setAmount,
    setChainSelectModalActive,
    toggleWalletSidebar,
    openBridgeTokenList,
    onAfterBridgeCompleted
  };

  return (
    <SwapContext.Provider value={contextValue}>
      <>
        {props.children}

        {isAssetChangeModalActive && originChain && destChain && (
          <TokenList
            chain={chain}
            network={network}
            originChain={originChain}
            destChain={destChain}
            onAssetClick={onAssetClick}
            onClose={() => setAssetChangeModalActive(false)}
          />
        )}

        {isChainSelectModalActive && (
          <BridgeChainList
            network={network}
            onChainClick={onChainClick}
            selectedChain={
              isChainSelectModalActive === "A" ? destChain : originChain
            }
            onClose={() => setChainSelectModalActive(undefined)}
          />
        )}

        {/* <BridgeSettings
          isActive={isSettingsModalActive}
          onClose={() => setSettingsModalActive(false)}
          slippage={slippage}
          onSlippageChange={setSlippage}
        /> */}
      </>
    </SwapContext.Provider>
  );
};

export const useBridgeSwap = () => useContext(SwapContext);