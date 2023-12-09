import { tx } from "@cityofzion/neon-core";
import { IWalletType } from "../wallets/interfaces";

/* Wallets */
export const O3 = "O3";
export const NEON = "NEON";
export const NEO_LINE = "NEO_LINE";
export const NEO_LINE_MOBILE = "NEO_LINE_MOBILE";
export const ONE_GATE = "ONE_GATE";

export const WALLET_LIST: {
  label: string;
  key: IWalletType;
}[] = [
  {
    label: "NeoLine",
    key: NEO_LINE
  },
  {
    label: "Neon",
    key: NEON
  },
  {
    label: "OneGate",
    key: ONE_GATE
  },
  {
    label: "O3",
    key: O3
  },
  {
    label: "NeoLine Mobile",
    key: NEO_LINE_MOBILE
  }
];

export const TESTNET_CONFIG = {
  label: "N3TestNet",
  // url: "http://seed1t5.neo.org:20332",
  url: "https://us-central1-ez-router.cloudfunctions.net/route/seed1t5.neo.org:20332"
};


export const MAINNET_CONFIG = {
  label: "N3MainNet",
  url: "https://mainnet1.neo.coz.io:443",
};

export const DEFAULT_WITNESS_SCOPE = (senderHash: string) => {
  return {
    account: senderHash,
    scopes: tx.WitnessScope.CalledByEntry
  };
};
