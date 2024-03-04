import { IConnectedWallet, IWalletType } from "./interfaces";
import { NEO_LINE, NEO_LINE_MOBILE, NEON, O3, ONE_GATE } from "../consts";
import { INetworkType } from "../network";
import { initNeoLine, initNeoLineMobile } from "./neoline";
import { initOG } from "./onegate";
import { initO3 } from "./o3";
import { initNeon } from "./neon";
import { tx } from "@cityofzion/neon-core";

const WALLET_LIST: {
  label: string;
  key: IWalletType;
}[] = [
  {
    label: "NeoLine",
    key: NEO_LINE,
  },
  {
    label: "Neon",
    key: NEON,
  },
  {
    label: "OneGate",
    key: ONE_GATE,
  },
  {
    label: "O3",
    key: O3,
  },
  {
    label: "NeoLine Mobile",
    key: NEO_LINE_MOBILE,
  },
];

export class WalletAPI {
  static list = WALLET_LIST;

  static init = async (
    walletType: IWalletType,
    network: INetworkType
  ): Promise<IConnectedWallet> => {
    let instance;
    switch (walletType) {
      case O3:
        instance = await initO3();
        break;
      case NEO_LINE:
        instance = await initNeoLine();
        break;
      case NEON:
        instance = await initNeon(network);
        break;
      case NEO_LINE_MOBILE:
        instance = await initNeoLineMobile();
        break;
      case ONE_GATE:
        instance = await initOG();
        break;
    }
    return {
      key: walletType,
      ...instance,
    };
  };

  /* Control signing and send transaction. TODO:Need to improve type hardcoding later */
  static invoke = async (
    connectedWallet: IConnectedWallet,
    currentNetwork: INetworkType,
    invokeScript: any,
    extraSystemFee?: string
  ): Promise<string> => {
    if (
      connectedWallet.network &&
      connectedWallet.network.defaultNetwork &&
      connectedWallet.network.defaultNetwork !== currentNetwork
    ) {
      throw new Error(
        "Your wallet's network doesn't match with the app network setting."
      );
    }

    // This is a hotfix for onegage signer scope bug
    if (connectedWallet.key === ONE_GATE) {
      invokeScript.signers = invokeScript.signers.map((signer) => {
        return {
          ...signer,
          scopes: tx.toString(signer.scopes),
        };
      });
    }

    const instance = connectedWallet.instance;

    if (connectedWallet.key === NEON) {
      const invocations = [invokeScript];
      const signers = invokeScript.signers;
      return await instance.invokeFunction({ invocations, signers });
    } else {
      const res = await instance.invoke(invokeScript, currentNetwork);
      return res.txid;
    }
  };

  /* Control signing and send transaction. TODO:Need to improve type hardcoding later */
  static invokeMulti = async (
    connectedWallet: IConnectedWallet,
    currentNetwork: INetworkType,
    invokeArgs: object[],
    signers: object[]
  ): Promise<string> => {
    if (
      connectedWallet.network &&
      connectedWallet.network.defaultNetwork &&
      connectedWallet.network.defaultNetwork !== currentNetwork
    ) {
      throw new Error(
        "Your wallet's network doesn't match with the app network setting."
      );
    }

    const instance = connectedWallet.instance;

    if (connectedWallet.key === NEON) {
      return await instance.invokeFunction({
        invocations: invokeArgs,
        signers,
      });
    } else if (
      connectedWallet.key === NEO_LINE ||
      connectedWallet.key === NEO_LINE_MOBILE
    ) {
      const res = await instance.invokeMultiple({
        invokeArgs,
        signers,
      });
      return res.txid;
    } else if (connectedWallet.key === ONE_GATE) {
      // This is a hotfix for onegage signer scope bug
      const ogSigners = signers.map((s: any) => {
        return {
          ...s,
          scopes: tx.toString(s.scopes),
        };
      });
      const res = await instance.invokeMultiple({
        invocations: invokeArgs,
        signers: ogSigners,
      });
      return res.txid;
    } else {
      const invokeRes = await instance.invokeMulti({
        invokeArgs,
        signers,
        network: currentNetwork,
      });
      return invokeRes.txid;
    }
  };
}
