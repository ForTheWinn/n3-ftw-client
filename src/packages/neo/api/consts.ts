import { GLOBAL } from "../../../consts";

const { MAINNET, TESTNET } = GLOBAL;

export const ENDPOINT = {
  [TESTNET]: "https://api.forthewin.network/testnet",
  [MAINNET]: "https://api.forthewin.network/mainnet"
  // [CONST.MAINNET]: "http://localhost:3000/mainnet",
};
