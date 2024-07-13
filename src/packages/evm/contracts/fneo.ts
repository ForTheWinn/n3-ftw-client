import {
  getBalance,
  readContract,
  simulateContract,
  writeContract,
} from "@wagmi/core";
import { getPrices } from "../../../common/routers/global";
import {
  NEO_BNEO_CONTRACT_ADDRESS,
  NEO_NEP_CONTRACT_ADDRESS,
} from "../../neo/consts/tokens";
import { BLOCK_TIME, MAINNET, NEO_CHAIN } from "../../../consts/global";
import FNEOABI from "./abi/fNEO.json";
import { ethers } from "ethers";
import { wagmiConfig } from "../../../wagmi-config";
import { NEP_ADDRESSES } from "../../../consts/contracts";
import { CHAINS } from "../../../consts/chains";
export interface IfNEODetail {
  totalSupply: string;
  nepPerBlock: string;
  apr: string;
  claimable: string;
  availableRewardsInContract: string;
}

export const claim = async (
  chainId: number,
  contractHash: string
): Promise<string> => {
  const args = {
    address: contractHash as any,
    abi: FNEOABI,
    functionName: "claim",
    chainId,
  };
  await simulateContract(wagmiConfig, args);
  return await writeContract(wagmiConfig, args);
};

export const getfNEODetail = async (
  chain: CHAINS,
  chainId: number,
  contractHash: string,
  network: any,
  address?: string
): Promise<IfNEODetail> => {
  const prices = await getPrices(NEO_CHAIN);
  const neoPrice: number = prices[NEO_BNEO_CONTRACT_ADDRESS[MAINNET]];
  const nepPrice: number = prices[NEO_NEP_CONTRACT_ADDRESS[MAINNET]];

  // Constants
  const secondsInYear = BigInt(60 * 60 * 24 * 365); // Convert seconds in a year to BigInt
  const blockTime = BigInt(BLOCK_TIME[chainId]); // Block time in seconds, also converted to BigInt
  const scale = BigInt(1e8); // Scale for price conversion, assuming 8 decimal places for tokens

  // Convert float prices to BigInt scaled to token's smallest unit (8 decimal places here for example)
  const neoPriceBigInt = BigInt(Math.round(neoPrice * 1e8));
  const nepPriceBigInt = BigInt(Math.round(nepPrice * 1e8));

  // Assuming totalSupply and nepPerBlock are fetched correctly in BigInt from the blockchain
  const totalSupplyBigInt = await getTotalSupply(contractHash, chainId); // Replace with actual contract call
  const nepPerBlockBigInt = await getNepPerBlock(contractHash, chainId); // Replace with actual contract call
  const available = await getBalance(wagmiConfig, {
    address: contractHash as any,
    token: NEP_ADDRESSES[chain][network] as any,
  });

  // Calculate blocks per year and NEP rewarded per year
  const blocksPerYear = secondsInYear / blockTime;
  const nepRewardedPerYear = blocksPerYear * nepPerBlockBigInt;

  // Calculate the dollar value of NEP rewarded per year
  const nepRewardedPerYearInDollars =
    (nepRewardedPerYear * nepPriceBigInt) / scale;

  let aprValue = "0.00%"; // Default APR value

  // Calculate APR only if totalSupply is greater than zero to avoid division by zero
  if (totalSupplyBigInt > BigInt(0)) {
    const totalNEOValueInDollars = (totalSupplyBigInt * neoPriceBigInt) / scale;
    const aprBigInt =
      (nepRewardedPerYearInDollars * BigInt(100) * scale) /
      totalNEOValueInDollars;
    const aprAsNumber = Number(aprBigInt) / 1e8; // Scale down by the precision factor to get a percentage
    aprValue = aprAsNumber.toFixed(2) + "%"; // Format as a string with two decimal places
  }

  return {
    totalSupply: ethers.formatUnits(totalSupplyBigInt, 8),
    nepPerBlock: ethers.formatUnits(nepPerBlockBigInt, 8),
    apr: aprValue,
    claimable: await getClaimableAmount(contractHash, chainId, address),
    availableRewardsInContract: available.formatted,
  };
};

// Helper functions to mock fetching contract values, replace these with actual contract interaction logic
async function getTotalSupply(contractHash, chainId) {
  let totalSupply: any = await readContract(wagmiConfig, {
    address: contractHash as any,
    abi: FNEOABI,
    functionName: "totalSupply",
    chainId,
  });
  return totalSupply;
}

async function getNepPerBlock(contractHash, chainId): Promise<bigint> {
  return (await readContract(wagmiConfig, {
    address: contractHash as any,
    abi: FNEOABI,
    functionName: "nepPerBlock",
    chainId,
  })) as bigint;
}

async function getClaimableAmount(
  contractHash,
  chainId,
  address
): Promise<string> {
  if (!address) return "0";
  const res = (await readContract(wagmiConfig, {
    address: contractHash as any,
    abi: FNEOABI,
    functionName: "claimable",
    args: [address],
    chainId,
  })) as bigint;
  return ethers.formatUnits(res, 8);
}
