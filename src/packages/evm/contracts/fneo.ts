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
import { MAINNET, NEO_CHAIN, TESTNET } from "../../../consts/global";
import FNEOABI from "./abi/fNEO.json";
import { formatAmount } from "../../../common/helpers";
import { CHAINS, CONFIGS } from "../../../consts/chains";
import { INetworkType } from "../../neo/network";
export interface IfNEODetail {
  totalSupply: string;
  apr: string;
  claimable: string;
}

export const claim = async (
  chain: CHAINS,
  network: INetworkType,
  contractHash: string
): Promise<string> => {
  const chainId = CONFIGS[network][chain].chainId;
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
  chain: CHAINS,
  network: INetworkType,
  contractHash: string,
  rewardsPerBlock: number,
  address?: string
): Promise<IfNEODetail> => {
  const prices = await getPrices(NEO_CHAIN);
  const neoPrice = prices[NEO_BNEO_CONTRACT_ADDRESS[MAINNET]];
  const nepPrice = prices[NEO_NEP_CONTRACT_ADDRESS[MAINNET]];
  const chainId = CONFIGS[network][chain].chainId;
  let claimable = "0";
  let totalSupply: any = await readContract({
    address: contractHash as any,
    abi: erc20ABI,
    functionName: "totalSupply",
    chainId,
  });
  totalSupply = formatAmount(totalSupply.toString(), 8);

  const nepPerYear = ((60 * 60 * 24 * 365) / 2) * rewardsPerBlock;

  if (address) {
    const res = (await readContract({
      address: contractHash as any,
      abi: FNEOABI,
      functionName: "claimable",
      args: [address],
      chainId,
    })) as string;
    claimable = formatAmount(res.toString(), 8);
  }
  return {
    totalSupply,
    apr:
      ((((nepPerYear / totalSupply) * nepPrice) / neoPrice) * 100).toString() +
      "%",
    claimable,
  };
};
