import { waitForTransaction } from "@wagmi/core";
import { IClaimableRewards } from "../../../packages/neo/contracts/ftw/farm-v2/interfaces";
import { INetworkType } from "../../../packages/neo/network";
import { CHAINS } from "../../../consts/chains";
import { IConnectedWallet } from "../../../packages/neo/wallets/interfaces";
import {
  getPools,
  getStakedTokens,
  stake,
  unStake,
  getClaimable as polygonGetClaimable,
  claim as polygonClaim,
} from "../../../packages/polygon/contracts/farm";
import {
  isApprovedForAll,
  setApprovalForAll,
} from "../../../packages/polygon/contracts/swap";
import { IClaimable, IFarmPair } from "./interfaces";
import { ISwapLPToken } from "../swap/interfaces";
import { CONTRACT_MAP } from "../../../consts/contracts";
import { FARM, NEO_CHAIN, POLYGON_CHAIN } from "../../../consts/global";
import { FarmV2Contract } from "../../../packages/neo/contracts/ftw/farm-v2";

export const getPoolList = (
  chain: CHAINS,
  network: INetworkType
): Promise<IFarmPair[]> => {
  switch (chain) {
    case NEO_CHAIN:
      return new FarmV2Contract(network).getPools();
    case POLYGON_CHAIN:
      return getPools(network);
  }
};

export const getStakedLPTokens = async (
  chain: CHAINS,
  network: INetworkType,
  address: string
): Promise<ISwapLPToken[]> => {
  switch (chain) {
    case NEO_CHAIN:
      const tokens: ISwapLPToken[] = [];
      const res = await new FarmV2Contract(network).getStakedLPTokens(address);
      for (const token of res) {
        tokens.push({
          tokenId: token.tokenId,
          tokenA: token.tokenA,
          tokenB: token.tokenB,
          symbolA: token.symbolA,
          symbolB: token.symbolB,
          amountA: token.amountA,
          amountB: token.amountB,
          decimalsA: token.decimalsA,
          decimalsB: token.decimalsB,
          sharesPercentage: token.sharesPercentage.toString(),
        });
      }
      return tokens;
    case POLYGON_CHAIN:
      return getStakedTokens(network, address);
  }
};

export const getClaimable = async (
  chain: CHAINS,
  network: INetworkType,
  address: string
): Promise<IClaimable> => {
  switch (chain) {
    case NEO_CHAIN:
      return await new FarmV2Contract(network).getClaimable(address);
    case POLYGON_CHAIN:
      return polygonGetClaimable(network, address);
  }
};

export const stakeLPToken = async (
  chain: CHAINS,
  network: INetworkType,
  tokenId: string,
  address: string,
  connectedWallet?: IConnectedWallet
) => {
  switch (chain) {
    case NEO_CHAIN:
      if (connectedWallet) {
        return new FarmV2Contract(network).stake(connectedWallet, tokenId);
      } else {
        return "";
      }
    case POLYGON_CHAIN:
      if (
        !(await isApprovedForAll(
          network,
          address,
          CONTRACT_MAP[chain][network][FARM]
        ))
      ) {
        const hash: any = await setApprovalForAll(
          network,
          CONTRACT_MAP[chain][network][FARM]
        );
        await waitForTransaction({ hash });
      }
      return stake(network, tokenId);
  }
};

export const unStakeLPToken = async (
  chain: CHAINS,
  network: INetworkType,
  tokenId: string,
  connectedWallet?: IConnectedWallet
) => {
  switch (chain) {
    case NEO_CHAIN:
      if (connectedWallet) {
        return new FarmV2Contract(network).remove(connectedWallet, tokenId);
      } else {
        return "";
      }
    case POLYGON_CHAIN:
      return unStake(network, tokenId);
  }
};

export const claim = async (
  chain: CHAINS,
  network: INetworkType,
  items: IClaimableRewards[],
  connectedWallet?: IConnectedWallet
): Promise<string> => {
  switch (chain) {
    case NEO_CHAIN:
      if (connectedWallet) {
        return new FarmV2Contract(network).claimMulti(connectedWallet, items);
      }
      return "";
    case POLYGON_CHAIN:
      return polygonClaim(network, items);
  }
};
