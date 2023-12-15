import { CHAINS } from "../../../consts/chains";
import { NEO_CHAIN } from "../../../consts/global";
import { getTokenList } from "../../../packages/evm/contracts/smith";
import { SmithContract } from "../../../packages/neo/contracts/ftw/smith";
import { INetworkType } from "../../../packages/neo/network";
import { ISmithTokenDataProps } from "./interfaces";

export const getSmithTokenList = (
  chain: CHAINS,
  network: INetworkType,
  page: number
): Promise<ISmithTokenDataProps> => {
  switch (chain) {
    case NEO_CHAIN:
      return new SmithContract(network).getNEP17Records(page);
    default:
      return getTokenList(chain, network);
  }
};
