import { readContract, prepareWriteContract } from "@wagmi/core";

import FTWBridge from "./abi/FTWBridge.json";
import { Network } from "../../neo/network";
import { ethers } from "ethers";

export const burn = (
  chainId: number,
  bridgeAddress: any,
  tokenAddress: string,
  receiver: string,
  amount: string
) => {
  console.log(tokenAddress)
  return prepareWriteContract({
    address: bridgeAddress,
    abi: FTWBridge,
    functionName: "burn",
    args: [tokenAddress, receiver, amount],
    chainId
  });
};

export const getNextMintNo = async (
  chainId: number,
  address: any,
  no: string | number
): Promise<boolean> => {
  const res: any = await readContract({
    chainId,
    address,
    abi: FTWBridge,
    functionName: "getMintNo",
    args: []
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
      minted = await readContract({
        address,
        abi: FTWBridge,
        functionName: "isMinted",
        args: [no],
        chainId
      });
    } catch (e) {
      console.error(e)
      await Network.sleep(3000);
    }
  } while (!minted);

  return true;
};

export const getMintoNoFromLogs = (logs: any) => {
  let iface = new ethers.utils.Interface(FTWBridge);
  let mintNo;
  logs.forEach((log) => {
    try {
      const parsedLog = iface.parseLog(log);
      if (parsedLog.name === "BridgeOut") {
        mintNo = parsedLog.args[0].toString();
      }
    } catch (e) {
      //TODO:re-visit
      console.log(e);
    }
  });
  return mintNo;
};
