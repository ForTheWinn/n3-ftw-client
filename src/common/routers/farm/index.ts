import { CHAINS, NEO_CHAIN, POLYGON_CHAIN } from "../../../consts/chains";
import { writeContract } from "@wagmi/core";
import { RestAPI } from "../../../packages/neo/api";
import { IPrices } from "../../../packages/neo/api/interfaces";
import { SwapContract } from "../../../packages/neo/contracts";
import { FarmV2Contract } from "../../../packages/neo/contracts/ftw/farm-v2";
import {
  IClaimableRewards,
  IPoolEnhanced
} from "../../../packages/neo/contracts/ftw/farm-v2/interfaces";
import { INetworkType } from "../../../packages/neo/network";
import { withDecimal } from "../../../packages/neo/utils";
import { IConnectedWallet } from "../../../packages/neo/wallets/interfaces";
import {
  getPools,
  getStakedTokens,
  stake,
  unStake,
  getClaimable as polygonGetClaimable,
  claim as polygonClaim
} from "../../../packages/polygon/contracts/farm";
import {
  getLPTokens as getPolygonLPTokens,
  getReserves as getPolygonReserves,
  isApprovedForAll,
  setApprovalForAll
} from "../../../packages/polygon/contracts/swap";
import { IClaimable } from "./interfaces";
import { CONTRACTS, GLOBAL } from "../../../consts";
import { ethers } from "ethers";
import { getTokenByHash } from "../../../helpers";
import { ISwapLPToken } from "../swap/interfaces";

export const getPrices = (chain: CHAINS): Promise<IPrices> => {
  switch (chain) {
    case NEO_CHAIN:
      return new RestAPI(GLOBAL.MAINNET).getPrices();
    case POLYGON_CHAIN:
      return new RestAPI(GLOBAL.MAINNET).getPrices();
  }
};

export const getPoolList = (
  chain: CHAINS,
  network: INetworkType
): Promise<IPoolEnhanced[]> => {
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
          sharesPercentage: token.sharesPercentage.toString()
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
          CONTRACTS.CONTRACT_LIST[chain][network][GLOBAL.FARM]
        ))
      ) {
        const config = await setApprovalForAll(
          network,
          CONTRACTS.CONTRACT_LIST[chain][network][GLOBAL.FARM]
        );
        const res = await writeContract(config);
        await res.wait();
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
