import WcSdk from "@cityofzion/wallet-connect-sdk-core";
import buffer from "buffer";
import { INetworkType } from "../../network";
import { SignClient } from "@walletconnect/sign-client";

import * as events from "./events";
import * as consts from "./consts";
import { MAINNET } from "../../../../consts/global";

const getWcNeonWalletInstance = async (
  network: INetworkType
): Promise<WcSdk> => {
  // Set window.Buffer to solve ReferenceError: Buffer is not defined
  window.Buffer = buffer.Buffer;
  const instance = new WcSdk(
    // @ts-ignore
    await SignClient.init({
      projectId: "b691f14b8343e73c585d305eac3f6804", // the ID of your project on Wallet Connect website
      relayUrl: "wss://relay.walletconnect.com", // we are using walletconnect's official relay server
      metadata: {
        name: "FTW", // your application name to be displayed on the wallet
        description: "All-in-one solution for crypto projects", // description to be shown on the wallet
        url: "https://www.forthewin.network", // url to be linked on the wallet
        icons: ["https://www.forthewin.network/logo/FTW_512_512.svg"], // icon to be shown on the wallet
      },
    })
  );

  // Subscribe to Wallet Connect events
  instance.signClient.on("session_delete", async () => {
    instance.session = null;
    events.dispatchEventNeonWalletDisconnected();
  });

  // Load any existing connection, it should be called after the initialization
  await instance.loadSession();

  // Check if user has a session and get its accounts
  if (!instance.isConnected()) {
    const connectingNetwork =
      network === MAINNET ? "neo3:mainnet" : "neo3:testnet";
    await instance.connect(connectingNetwork, []);
  }
  return instance;
};

export const initNeon = async (network: INetworkType) => {
  const instance = await getWcNeonWalletInstance(network);
  if (instance.isConnected() && instance.session) {
    const account = {
      address: instance.getAccountAddress(),
      label: "Neon", // Neon not provide this info
    };
    return { account, instance };
  }
};

export { events, consts };
