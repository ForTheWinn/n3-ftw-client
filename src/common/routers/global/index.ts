import { getBalance, getToken, waitForTransactionReceipt } from "@wagmi/core";
import { CHAINS, CONFIGS } from "../../../consts/chains";
import { INetworkType, Network } from "../../../packages/neo/network";
import { ITokenState } from "../../../ui/pages/Swap/scenes/Swap/interfaces";
import { IPrices } from "../../../packages/neo/api/interfaces";
import { MAINNET, NEO_CHAIN } from "../../../consts/global";
import { base64ToString, getUserBalance } from "../../../packages/neo/utils";
import { WENT_WRONG } from "../../../consts/messages";
import { RestAPI } from "../../../packages/neo/api";
import { ethers } from "ethers";
import { formatAmount } from "../../helpers";
import { wagmiConfig } from "../../../wagmi-config";

export const waitTransactionUntilSubmmited = async (
  chain: CHAINS,
  network: INetworkType,
  txid: string
): Promise<boolean> => {
  switch (chain) {
    case NEO_CHAIN:
      await Network.getRawTx(txid, network);
      return true;
    default:
      const chainId = CONFIGS[network][chain].chainId;
      await waitForTransactionReceipt(wagmiConfig, {
        hash: txid as `0x${string}`,
        chainId,
      });
      return true;
  }
};

export const getPrices = async (chain: CHAINS): Promise<IPrices> => {
  switch (chain) {
    case NEO_CHAIN:
      return new RestAPI(MAINNET).getPrices();
    default:
      return new RestAPI(MAINNET).getPrices();
  }
};

// Return formatted balance
export const fetchTokenBalance = async (
  chain: CHAINS,
  network: INetworkType,
  address: any,
  tokenHash: any
): Promise<string> => {
  switch (chain) {
    case NEO_CHAIN:
      return await getUserBalance(network, address, tokenHash);
    default:
      const chainId = CONFIGS[network][chain].chainId;
      const res = await getBalance(wagmiConfig, {
        address,
        token: tokenHash,
        chainId,
      });
      return res.formatted;
  }
};

export const fetchTokenInfo = async (
  chain: CHAINS,
  network: INetworkType,
  hash: string
): Promise<ITokenState> => {
  switch (chain) {
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
    default:
      const chainId = CONFIGS[network][chain].chainId;
      const data = await getToken(wagmiConfig, {
        address: hash as any,
        chainId,
      });
      return {
        hash,
        decimals: data.decimals,
        symbol: data.symbol as any,
        icon: "",
        totalSupply: ethers
          .formatUnits(data.totalSupply.value.toString(), data.decimals)
          .toString(),
      };
  }
};
