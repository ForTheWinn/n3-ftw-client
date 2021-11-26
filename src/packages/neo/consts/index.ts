import { CONST as NEON_CONST } from "@cityofzion/neon-core";
import { INetworkType } from "../network";
import { IWalletType } from "../wallet/interfaces";

/* Wallets */
export const O3 = "O3";
export const NEO_LINE = "NEO_LINE";
export const DEV = "DEV";
export const WALLET_LIST: {
  label: string;
  key: IWalletType;
}[] = [
  {
    label: "Dev",
    key: DEV,
  },
  {
    label: "NEO Line",
    key: NEO_LINE,
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
  url: "http://seed2t4.neo.org:20332",
};

export const MAINNET_CONFIG = {
  label: "N3MainNet",
  url: "http://127.0.0.1:50012",
};

/* Contract hashes */
export const GAS_SCRIPT_HASH = NEON_CONST.NATIVE_CONTRACT_HASH.GasToken;
export const NEO_SCRIPT_HASH = NEON_CONST.NATIVE_CONTRACT_HASH.NeoToken;

export const TOKEN_LIST = (network: INetworkType) => [
  NEO_SCRIPT_HASH,
  GAS_SCRIPT_HASH,
  // NFT_SCRIPT_HASH[network]
];

/* Dev wallet */
export const DEV_WALLET_PRIVATE_KEY =
  "7b5d7fda53932ed9d43eb848dd521455767a4d40b5a994e6f351605e5a4ce26a";
