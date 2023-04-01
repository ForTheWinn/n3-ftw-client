import { tx } from "@cityofzion/neon-core";
import { IWalletType } from "../wallets/interfaces";

/* Wallets */
export const O3 = "O3";
export const NEON = "NEON";
export const NEO_LINE = "NEO_LINE";
export const DEV = "DEV";
export const ONE_GATE = "ONE_GATE";

export const TOKEN_CATEGORY_GENERAL = "GENERAL";
export const TOKEN_CATEGORY_METAVERSE = "METAVERSE";
export const TOKEN_CATEGORY_STARTUPS = "STARTUPS";

export const WALLET_LIST: {
  label: string;
  key: IWalletType;
}[] = [
  {
    label: "NEO Line",
    key: NEO_LINE
  },
  {
    label: "Neon wallet",
    key: NEON
  },
  {
    label: "OneGate",
    key: ONE_GATE
  },
  {
    label: "O3",
    key: O3
  }
];

/* Network configs */
export const PRIVATE_CONFIG = {
  label: "privateNet",
  url: "http://127.0.0.1:50012"
};

export const TESTNET_CONFIG = {
  label: "N3TestNet",
  // url: "http://seed1t5.neo.org:20332",
  url:
    "https://us-central1-ez-router.cloudfunctions.net/route/seed1t5.neo.org:20332"
};

// Using for tx monitor
export const TESTNET_CONFIG_2 = {
  label: "N3TestNet",
  // url: "http://seed2t5.neo.org:20332",
  url:
    "https://us-central1-ez-router.cloudfunctions.net/route/seed1t5.neo.org:20332"
};

export const MAINNET_CONFIG = {
  label: "N3MainNet",
  url: "https://n3seed2.ngd.network:10332"
};

/* Dev wallet */
export const DEV_WALLET_PRIVATE_KEY = "";

export const DEFAULT_WITNESS_SCOPE = (senderHash: string) => {
  return {
    account: senderHash,
    scopes: tx.WitnessScope.CalledByEntry
  };
};

