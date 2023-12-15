import { readContract, prepareWriteContract, writeContract } from "@wagmi/core";
import { Alchemy, Network } from "alchemy-sdk";

import FTWSmith from "./abi/FTWSmith.json";
import { CONTRACT_MAP } from "../../../consts/contracts";
import { INetworkType } from "../../neo/network";
import { ALCHEMY_KEY, SMITH } from "../../../consts/global";
import { ethers } from "ethers";
import { ISmithTokenInfo } from "../interfaces";
import { CHAINS, CONFIGS } from "../../../consts/chains";

export const createTokenContract = async (
  chain: CHAINS,
  network: INetworkType,
  name: string,
  symbol: string,
  totalSupply: string,
  decimals: string,
  website: string,
  icon: string
): Promise<string> => {
  const config = await prepareWriteContract({
    address: CONTRACT_MAP[chain][network][SMITH],
    abi: FTWSmith,
    functionName: "createToken",
    args: [name, symbol, totalSupply, decimals, icon, website],
  });
  const { hash } = await writeContract(config);
  return hash;
};

export const setTokenData = (
  chain: CHAINS,
  network: INetworkType,
  contractHash: string,
  icon: string,
  website: string
) => {
  return prepareWriteContract({
    address: CONTRACT_MAP[chain][network][SMITH],
    abi: FTWSmith,
    functionName: "setTokenData",
    args: [contractHash, icon, website],
  });
};

export const getContractHashFromLogs = (logs: any) => {
  let iface = new ethers.Interface(FTWSmith);
  let contractHash;
  logs.forEach((log) => {
    try {
      const parsedLog = iface.parseLog(log);
      if (parsedLog?.name === "TokenCreated") {
        contractHash = parsedLog.args[0];
      }
    } catch (e) {}
  });
  return contractHash;
};

export const getTokenList = async (chain: CHAINS, network: INetworkType) => {
  const res: any = await readContract({
    address: CONTRACT_MAP[chain][network][SMITH],
    abi: FTWSmith,
    functionName: "getTokens",
    args: [30, 1],
    chainId: CONFIGS[network][chain].chainId,
  });
  return res;
};

const getTokenMetadata = async (
  chain: CHAINS,
  network: INetworkType,
  contractHash: string
) => {
  const res: any = await readContract({
    address: CONTRACT_MAP[chain][network][SMITH],
    abi: FTWSmith,
    functionName: "getTokenData",
    args: [contractHash],
    chainId: CONFIGS[network][chain].chainId,
  });
  return {
    icon: res[1],
    website: res[2],
  };
};

export const getTokenListFromProvider = async (
  chain,
  network
): Promise<ISmithTokenInfo[]> => {
  const apiKey = ALCHEMY_KEY[chain][network];
  let iface = new ethers.Interface(FTWSmith);
  const settings = {
    apiKey,
    network: Network.MATIC_MUMBAI,
  };

  const alchemy = new Alchemy(settings);
  const res = await alchemy.core.getLogs({
    fromBlock: "earliest",
    toBlock: "latest",
    address: CONTRACT_MAP[chain][network][SMITH],
  });

  // Array to store promises for all the metadata fetch operations
  const metadataFetchPromises: Promise<any>[] = [];
  const parsedLogs: any = [];

  for (const log of res) {
    const parsedLog = iface.parseLog(log);
    if (parsedLog?.name === "TokenCreated") {
      metadataFetchPromises.push(
        getTokenMetadata(chain, network, parsedLog.args[0])
      );
      parsedLogs.push(parsedLog);
    }
  }

  // Fetch all metadata in parallel
  const metadatas = await Promise.all(metadataFetchPromises);

  // Construct tokenLogs array with resolved metadata
  const tokenLogs: ISmithTokenInfo[] = metadatas.map((meta, index) => ({
    owner: parsedLogs[index].args[1],
    contractHash: parsedLogs[index].args[0],
    name: parsedLogs[index].args[2],
    symbol: parsedLogs[index].args[3],
    ...meta,
  }));

  return tokenLogs;
};
