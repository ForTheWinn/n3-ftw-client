import { waitForTransaction, fetchToken } from "@wagmi/core";
import { CHAINS } from "../../../consts/chains";
import { INetworkType, Network } from "../../../packages/neo/network";
import { ITokenState } from "../../../ui/pages/Swap/scenes/Swap/interfaces";
import { IPrices } from "../../../packages/neo/api/interfaces";
import { ETH_CHAIN, MAINNET, NEO_CHAIN, POLYGON_CHAIN } from "../../../consts/global";
import { base64ToString, getUserBalance } from "../../../packages/neo/utils";
import { WENT_WRONG } from "../../../consts/messages";
import { fetchBalance } from "@wagmi/core";
import { RestAPI } from "../../../packages/neo/api";
import { ethers } from "ethers";
import { formatAmount } from "../../helpers";

export const waitTransactionUntilSubmmited = async (
  chain: CHAINS,
  network: INetworkType,
  txid: string
): Promise<boolean> => {
  switch (chain) {
    case POLYGON_CHAIN || ETH_CHAIN:
      const data = await waitForTransaction({
        hash: txid as `0x${string}`,
      });
      return true;
    case NEO_CHAIN:
      const res = await Network.getRawTx(txid, network);
      return true;
  }
};

export const getPrices = async (chain: CHAINS): Promise<IPrices> => {
  return new RestAPI(MAINNET).getPrices();

  // switch (chain) {
  //   case NEO_CHAIN:
  //     return new RestAPI(MAINNET).getPrices();
  //   // case POLYGON_CHAIN:
  //   //   return undefined;
  // }
};

// Return formatted balance
export const fetchTokenBalance = async (
  chain: CHAINS,
  network: INetworkType,
  address: string,
  tokenHash: string
): Promise<string> => {
  switch (chain) {
    case NEO_CHAIN:
      return await getUserBalance(network, address, tokenHash);
    case POLYGON_CHAIN || ETH_CHAIN:
      const res = await fetchBalance({
        address,
        token: tokenHash,
      } as any);
      return res.formatted;
  }
};

export const fetchTokenInfo = async (
  chain: CHAINS,
  network: INetworkType,
  hash: string
): Promise<ITokenState> => {
  switch (chain) {
    case POLYGON_CHAIN || ETH_CHAIN:
      const data = await fetchToken({ address: hash as any });
      return {
        hash,
        decimals: data.decimals,
        symbol: data.symbol,
        icon: "",
        totalSupply: ethers
          .formatUnits(data.totalSupply.value.toString(), data.decimals)
          .toString(),
      };
    case NEO_CHAIN:
      const scripts: any = [];
      const script1 = {
        scriptHash: hash,
        operation: "symbol",
        args: [],
      };
      const script2 = {
        scriptHash: hash,
        operation: "decimals",
        args: [],
      };
      const script3 = {
        scriptHash: hash,
        operation: "totalSupply",
        args: [],
      };
      scripts.push(script1);
      scripts.push(script2);
      scripts.push(script3);
      const res = await Network.read(network, scripts);
      if (res.state === "FAULT") {
        throw new Error(res.exception ? res.exception : WENT_WRONG);
      }
      const symbol = base64ToString(res.stack[0].value as string);
      const decimals = parseFloat(res.stack[1].value as string);
      return {
        hash,
        symbol,
        decimals,
        icon: "",
        totalSupply: formatAmount(res.stack[2].value as any, decimals),
      };
  }
};
