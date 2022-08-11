import { tx } from "@cityofzion/neon-core";
import { IWalletType } from "../wallet/interfaces";

/* Wallets */
export const O3 = "O3";
export const NEON = "NEON";
export const NEO_LINE = "NEO_LINE";
export const DEV = "DEV";
export const ONE_GATE = "ONE_GATE";
export const WALLET_LIST: {
  label: string;
  key: IWalletType;
}[] = [
  {
    label: "NEO Line",
    key: NEO_LINE,
  },
  {
    label: "Neon wallet",
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
];

/* Network types */
export const PRIVATENET = "N3PrivateNet";
export const TESTNET = "N3TestNet";
export const MAINNET = "N3MainNet";

/* Network configs */
export const PRIVATE_CONFIG = {
  label: "privateNet",
  url: "http://127.0.0.1:50012",
};

export const TESTNET_CONFIG = {
  label: "N3TestNet",
  url: "http://seed1t5.neo.org:20332",
};

// Using for tx monitor
export const TESTNET_CONFIG_2 = {
  label: "N3TestNet",
  url: "http://seed2t5.neo.org:20332",
};

export const MAINNET_CONFIG = {
  label: "N3MainNet",
  url: "https://n3seed2.ngd.network:10332",
};

/* Dev wallet */
export const DEV_WALLET_PRIVATE_KEY =
  "7b5d7fda53932ed9d43eb848dd521455767a4d40b5a994e6f351605e5a4ce26a";

export const DEFAULT_WITNESS_SCOPE = (senderHash: string) => {
  return {
    account: senderHash,
    scopes: tx.WitnessScope.CalledByEntry,
  };
};

export const UNKNOWN_TOKEN_IMAGE = "/symbols/unknown.png";

export const TOKEN_CATEGORY_GENERAL = "GENERAL";
export const TOKEN_CATEGORY_METAVERSE = "METAVERSE";
export const TOKEN_CATEGORY_STARTUPS = "STARTUPS";
