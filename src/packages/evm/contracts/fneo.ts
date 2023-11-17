import {
  erc20ABI,
  readContract,
  prepareWriteContract,
  writeContract,
} from "@wagmi/core";
import { getPrices } from "../../../common/routers/global";
import {
  NEO_BNEO_CONTRACT_ADDRESS,
  NEO_NEP_CONTRACT_ADDRESS,
} from "../../neo/consts/neo-contracts";
import { BLOCK_TIME, MAINNET, NEO_CHAIN } from "../../../consts/global";
import FNEOABI from "./abi/fNEO.json";
import { formatAmount } from "../../../common/helpers";
import { ethers } from "ethers";
export interface IfNEODetail {
  totalSupply: string;
  nepPerBlock: string;
  apr: string;
  claimable: string;
}

export const claim = async (
  chainId: number,
  contractHash: string
): Promise<string> => {
  const config = await prepareWriteContract({
    address: contractHash as any,
    abi: FNEOABI,
    functionName: "claim",
    chainId,
  });
  const { hash } = await writeContract(config);
  return hash as string;
};

export const getfNEODetail = async (
  chainId: number,
  contractHash: string,
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
  };
};

// Helper functions to mock fetching contract values, replace these with actual contract interaction logic
async function getTotalSupply(contractHash, chainId) {
  let totalSupply: bigint = (await readContract({
    address: contractHash as any,
    abi: FNEOABI,
    functionName: "totalSupply",
    chainId,
  })) as bigint;
  return totalSupply;
}

async function getNepPerBlock(contractHash, chainId): Promise<bigint> {
  let nepPerBlock: bigint = (await readContract({
    address: contractHash as any,
    abi: FNEOABI,
    functionName: "nepPerBlock",
    chainId,
  })) as bigint;
  console.log(nepPerBlock);
  return nepPerBlock;
}

async function getClaimableAmount(
  contractHash,
  chainId,
  address
): Promise<string> {
  if (!address) return "0";

  const res = (await readContract({
    address: contractHash as any,
    abi: FNEOABI,
    functionName: "claimable",
    args: [address],
    chainId,
  })) as bigint;
  return ethers.formatUnits(res, 8);
}
