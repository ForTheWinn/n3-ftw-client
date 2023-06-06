import {
  erc20ABI,
  readContract,
  prepareWriteContract,
  writeContract
} from "@wagmi/core";
import { getPrices } from "../../common/routers/global";
import { NEO_CHAIN } from "../../consts/chains";
import { BNEO_SCRIPT_HASH, NEP_SCRIPT_HASH } from "../neo/consts/neo-contracts";
import { MAINNET, TESTNET } from "../../consts/global";
import { NEP_PER_BLOCK } from "./consts";
import { ethers } from "ethers";
import { IfNEODetail } from "./interfaces";
import FNEOABI from "./fNEO.json";

export const claim = async (
  contractHash: string,
  address: string
): Promise<string> => {
  const config = await prepareWriteContract({
    address: contractHash as any,
    abi: FNEOABI,
    functionName: "claim"
    // args: [address]
  });
  const { hash } = await writeContract(config);
  return hash as string;
};

export const getfNEODetail = async (
  chainId: number,
  contractHash: string,
  address?: string
): Promise<IfNEODetail> => {
  console.log(address);
  const prices = await getPrices(NEO_CHAIN);
  const neoPrice = prices[BNEO_SCRIPT_HASH[MAINNET]];
  const nepPrice = prices[NEP_SCRIPT_HASH[MAINNET]];

  let claimable = "0";
  let totalSupply: any = await readContract({
    address: contractHash as any,
    abi: erc20ABI,
    functionName: "totalSupply"
  });
  totalSupply = ethers.utils.formatUnits(totalSupply.toString(), 8);

  const nepPerYear =
    ((60 * 60 * 24 * 365) / 2) * NEP_PER_BLOCK[TESTNET][chainId];

  if (address) {
    const res = (await readContract({
      address: contractHash as any,
      abi: FNEOABI,
      functionName: "claimable",
      args: [address]
    })) as string;
    claimable = ethers.utils.formatUnits(res.toString(), 8);
  }
  return {
    totalSupply,
    apr:
      ((((nepPerYear / totalSupply) * nepPrice) / neoPrice) * 100).toString() +
      "%",
    claimable
  };
};
