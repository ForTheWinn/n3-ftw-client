import { GLOBAL } from "../../../../../consts";

const { TESTNET, MAINNET } = GLOBAL;

export const TOURNAMENT_SCRIPT_HASH = {
  [TESTNET]: "0x1666b9485e2faf13ccea24c9563dfa5cbd92a1ad",
  [MAINNET]: "0x0eb288c413b5d5ec4aa0df5aea34d9538b28dd29"
};

export const ADMIN_FOR_PLAY = {
  [TESTNET]: [
    "NTsSEKhpngsRsLZDcrJpMUT7523fcdM9qF",
    "NS9QLsaY8RzN9fxTWj9AECyLaJvsk38XUb"
  ],
  [MAINNET]: ["NS9QLsaY8RzN9fxTWj9AECyLaJvsk38XUb"]
};

export const SUPPORT_TICKET_PRICE = "0.2";
export const TOURNAMENT_TIME_PADDING = 3600000;
