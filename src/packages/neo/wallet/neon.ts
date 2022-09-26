import WcSdk from "@cityofzion/wallet-connect-sdk-core";
// import QRCodeModal from "@walletconnect/qrcode-modal";

import buffer from "buffer";
import { dispatchEventNeonWalletDisconnected } from "../../neon/events";
import { INetworkType } from "../network";
import { MAINNET } from "../consts";
import { SignClient } from "@walletconnect/sign-client";

const getWcNeonWalletInstance = async (
  network: INetworkType
): Promise<WcSdk> => {
  // Set window.Buffer to solve ReferenceError: Buffer is not defined
  window.Buffer = buffer.Buffer;
  const instance = new WcSdk(
    await SignClient.init({
      projectId: "your_project_id", // the ID of your project on Wallet Connect website
      relayUrl: "wss://relay.walletconnect.com", // we are using walletconnect's official relay server
      metadata: {
        name: "your_app_name", // your application name to be displayed on the wallet
        description: "your_app_desc", // description to be shown on the wallet
        url: "your_app_url", // url to be linked on the wallet
        icons: [
          "your_app_icon_url",
        ], // icon to be shown on the wallet
      },
    })
  );

  // Subscribe to Wallet Connect events
  instance.signClient.on("session_delete", async () => {
    instance.session = null;
    dispatchEventNeonWalletDisconnected();
  });

  // Load any existing connection, it should be called after the initialization
  await instance.loadSession();

  // Check if user has a session and get its accounts
  if (!instance.isConnected()) {
    const connectingNetwork = network === MAINNET ? "neo3:mainnet" : "neo3:testnet";
    await instance.connect(
      connectingNetwork // the blockchains your dapp accepts to connect
    );

    if (instance.isConnected()) {
      if (process.env.NODE_ENV === "development") {
        console.log("NEON: Connected to New Session");
        console.log(instance.session);
      }
    } else {
      console.log("NEON: Cannot connect to Neon Wallet");
    }
  } else if (instance.isConnected()) {
    if (process.env.NODE_ENV === "development") {
      console.log("NEON: Session Loaded");
      console.log(instance.session);
    }
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
