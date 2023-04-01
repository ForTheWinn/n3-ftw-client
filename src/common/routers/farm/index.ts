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
import { IReserveData } from "../../../packages/neo/contracts/ftw/swap/interfaces";
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
} from "../../../packages/polygon/farm";
import {
  getLPTokens as getPolygonLPTokens,
  getReserve as getPolygonReserves,
  isApprovedForAll,
  setApprovalForAll
} from "../../../packages/polygon/swap";
import { IClaimable, IFarmLPToken } from "./interfaces";
import { CONTRACTS, GLOBAL } from "../../../consts";

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
      return new FarmV2Contract(network).getPools(chain);
    case POLYGON_CHAIN:
      return getPools(network);
  }
};

// TODO: double check for optimize
export const getReserves = async (
  chain: CHAINS,
  network: INetworkType,
  tokenA: string,
  tokenB: string
): Promise<IReserveData> => {
  switch (chain) {
    case NEO_CHAIN:
      return new SwapContract(network).getReserve(tokenA, tokenB);
    case POLYGON_CHAIN:
      const res = await getPolygonReserves(network, tokenA, tokenB);
      return {
        pair: {
          [tokenA]: {
            symbol: "",
            decimals: 8,
            reserveAmount: parseFloat(res.reserveA),
            reserveAmountFormatted: withDecimal(res.reserveA, 8)
          },
          [tokenB]: {
            symbol: "",
            decimals: 18,
            reserveAmount: parseFloat(res.reserveB),
            reserveAmountFormatted: withDecimal(res.reserveB, 18)
          }
        },
        userBalances: {},
        totalShare: parseFloat(res.shares)
      };
  }
};

export const getLPTokens = async (
  chain: CHAINS,
  network: INetworkType,
  address: string
): Promise<IFarmLPToken[]> => {
  switch (chain) {
    case NEO_CHAIN:
      const tokens: IFarmLPToken[] = [];
      const res = await new SwapContract(network).getLPTokens(address);
      for (const token of res) {
        const reserves = await new SwapContract(network).getReserve(
          token.tokenA,
          token.tokenB
        );
        tokens.push({
          name: token.name,
          tokenA: token.tokenA,
          symbolA: token.symbolA,
          symbolB: token.symbolB,
          tokenB: token.tokenB,
          tokenId: token.tokenId,
          amountA: reserves.pair[token.tokenA].reserveAmountFormatted,
          amountB: reserves.pair[token.tokenB].reserveAmountFormatted,
          sharesPercentage: (
            (token.amount / reserves.totalShare) *
            100
          ).toFixed(2)
        });
      }
      return tokens;
    case POLYGON_CHAIN:
      return getPolygonLPTokens(network, address);
  }
};

export const getStakedLPTokens = async (
  chain: CHAINS,
  network: INetworkType,
  address: string
): Promise<IFarmLPToken[]> => {
  switch (chain) {
    case NEO_CHAIN:
      const tokens: IFarmLPToken[] = [];
      const res = await new SwapContract(network).getLPTokens(address);
      for (const token of res) {
        const reserves = await new SwapContract(network).getReserve(
          token.tokenA,
          token.tokenB
        );
        tokens.push({
          name: token.name,
          tokenA: token.tokenA,
          tokenB: token.tokenB,
          symbolA: token.symbolA,
          symbolB: token.symbolB,
          tokenId: token.tokenId,
          amountA: (
            (reserves.pair[token.tokenA].reserveAmount * token.amount) /
            reserves.totalShare
          ).toString(),
          amountB: (
            (reserves.pair[token.tokenB].reserveAmount * token.amount) /
            reserves.totalShare
          ).toString(),
          sharesPercentage: (
            (token.amount / reserves.totalShare) *
            100
          ).toFixed(2)
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
