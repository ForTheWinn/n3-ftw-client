import {
  readContract,
  writeContract,
  simulateContract,
} from "@wagmi/core";

import FTWBridge from "./abi/FTWBridge.json";
import { Network } from "../../neo/network";
import { ethers } from "ethers";
import { wagmiConfig } from "../../../wagmi-config";

export const burn = async (
  chainId: number,
  bridgeAddress: any,
  tokenAddress: string,
  receiver: string,
  amount: string
): Promise<string> => {
  const args = {
    address: bridgeAddress,
    abi: FTWBridge,
    functionName: "burn",
    args: [tokenAddress, receiver, amount],
    chainId,
  };
  await simulateContract(wagmiConfig, args);
  return await writeContract(wagmiConfig, args);
};

export const getNextMintNo = async (
  chainId: number,
  address: any
): Promise<boolean> => {
  const res: any = await readContract(wagmiConfig, {
    chainId,
    address,
    abi: FTWBridge,
    functionName: "getMintNo",
    args: [],
  });
  return res + 1;
};

export const getIsMinted = async (
  chainId: number,
  address: any,
  no: string | number
): Promise<boolean> => {
  let minted: any;
  do {
    try {
      minted = await readContract(wagmiConfig, {
        address,
        abi: FTWBridge,
        functionName: "isMinted",
        args: [no],
        chainId,
      });
    } catch (e) {
      console.error(e);
      await Network.sleep(3000);
    }
  } while (!minted);

  return true;
};

export const getMintoNoFromLogs = (logs: any) => {
  let iface = new ethers.Interface(FTWBridge);
  let mintNo;
  logs.forEach((log) => {
    try {
      const parsedLog = iface.parseLog(log);
      if (parsedLog?.name === "BridgeOut") {
        mintNo = parsedLog.args[0].toString();
      }
    } catch (e) {
      //TODO:re-visit
    }
  });
  return mintNo;
};

export const getBridgeFee = async (
  chainId: number,
  bridgeAddress: any
): Promise<string> => {
  const res: any = await readContract(wagmiConfig, {
    chainId,
    address: bridgeAddress,
    abi: FTWBridge,
    functionName: "feeAmount",
    args: [],
  });
  return ethers.formatUnits(res, 8);
};
