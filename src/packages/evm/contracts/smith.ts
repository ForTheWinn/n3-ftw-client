import { readContract, writeContract, simulateContract } from "@wagmi/core";
import { Alchemy, Network } from "alchemy-sdk";
import FTWSmith from "./abi/FTWSmith.json";
import { CONTRACT_MAP } from "../../../consts/contracts";
import { INetworkType } from "../../neo/network";
import { ALCHEMY_KEY, SMITH } from "../../../consts/global";
import { ethers } from "ethers";
import { ISmithTokenInfo } from "../interfaces";
import { CHAINS, CONFIGS } from "../../../consts/chains";
import { wagmiConfig } from "../../../wagmi-config";
import { smithABI } from "./abi/smithAbi";

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
  const args: any = {
    address: CONTRACT_MAP[chain][network][SMITH],
    abi: FTWSmith,
    functionName: "createToken",
    args: [name, symbol, totalSupply, decimals, icon, website],
  };
  await simulateContract(wagmiConfig, args);
  return await writeContract(wagmiConfig, args);
};

export const setTokenData = async (
  chain: CHAINS,
  network: INetworkType,
  contractHash: string,
  icon: string,
  website: string
) => {
  const args: any = {
    address: CONTRACT_MAP[chain][network][SMITH],
    abi: FTWSmith,
    functionName: "setTokenData",
    args: [contractHash, icon, website],
  };
  await simulateContract(wagmiConfig, args);
  return writeContract(wagmiConfig, args);
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

const getProvider = (network: INetworkType, chain: CHAINS) => {
  const rpcUrl = CONFIGS[network][chain].rpc;
  return new ethers.JsonRpcProvider(rpcUrl);
};

export const getTokenList = async (chain: CHAINS, network: INetworkType) => {
  const provider = getProvider(network, chain);
  const contractAddress = CONTRACT_MAP[chain][network][SMITH];
  const contract = new ethers.Contract(contractAddress, FTWSmith, provider);

  const res1 = await contract.getTokens(30, 1); // Calls the getTokens function on the contract
  const replacer = (key, value) =>
    typeof value === "bigint"
      ? value.toString() // Convert BigInt to a string
      : value; // Return other values unchanged

  const jsonString = JSON.stringify(res1, replacer, 2);

  const res: any = await readContract(wagmiConfig, {
    address: CONTRACT_MAP[chain][network][SMITH] as any,
    abi: smithABI,
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
  const res: any = await readContract(wagmiConfig, {
    address: CONTRACT_MAP[chain][network][SMITH] as any,
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
