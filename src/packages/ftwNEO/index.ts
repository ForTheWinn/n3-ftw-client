import {
  erc20ABI,
  readContract,
  prepareWriteContract,
  writeContract,
} from "@wagmi/core";
import { getPrices } from "../../common/routers/global";
import {
  NEO_BNEO_CONTRACT_ADDRESS,
  NEO_NEP_CONTRACT_ADDRESS,
} from "../neo/consts/neo-contracts";
import { MAINNET, NEO_CHAIN, TESTNET } from "../../consts/global";
import { NEP_PER_BLOCK } from "./consts";
import { ethers } from "ethers";
import { IfNEODetail } from "./interfaces";
import FNEOABI from "./fNEO.json";

export const claim = async (contractHash: string): Promise<string> => {
  const config = await prepareWriteContract({
    address: contractHash as any,
    abi: FNEOABI,
    functionName: "claim",
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
  const neoPrice = prices[NEO_BNEO_CONTRACT_ADDRESS[MAINNET]];
  const nepPrice = prices[NEO_NEP_CONTRACT_ADDRESS[MAINNET]];

  let claimable = "0";
  let totalSupply: any = await readContract({
    address: contractHash as any,
    abi: erc20ABI,
    functionName: "totalSupply",
  });
  totalSupply = ethers.utils.formatUnits(totalSupply.toString(), 8);

  const nepPerYear =
    ((60 * 60 * 24 * 365) / 2) * NEP_PER_BLOCK[TESTNET][chainId];

  if (address) {
    const res = (await readContract({
      address: contractHash as any,
      abi: FNEOABI,
      functionName: "claimable",
      args: [address],
    })) as string;
    claimable = ethers.utils.formatUnits(res.toString(), 8);
  }
  return {
    totalSupply,
    apr:
      ((((nepPerYear / totalSupply) * nepPrice) / neoPrice) * 100).toString() +
      "%",
    claimable,
  };
};
