import { INetworkType, Network } from "../../../network";
import { SWAP_SCRIPT_HASH } from "../swap/consts";
import { IConnectedWallet } from "../../../wallets/interfaces";
import { wallet as NeonWallet } from "@cityofzion/neon-core";
import { getDefaultWitnessScope } from "../../../utils";
import { IClaimableRewards, IPool } from "./interfaces";
import { FARM_V2_SCRIPT_HASH } from "./consts";
import { parseMapValue, withDecimal } from "../../../utils";
import { ILPToken } from "../swap/interfaces";
import { BOYZ_SCRIPT_HASH } from "../boyz/consts";
import {
  IClaimable,
  IFarmPair,
} from "../../../../../common/routers/farm/interfaces";
import { WENT_WRONG } from "../../../../../consts/messages";
import { NEO_CHAIN } from "../../../../../consts/global";
import { NeoWallets } from "../../../wallets";
import { getTokenByHash } from "../../../../../common/helpers";

export class FarmV2Contract {
  network: INetworkType;
  contractHash: string;

  constructor(networkType: INetworkType) {
    this.network = networkType;
    this.contractHash = FARM_V2_SCRIPT_HASH[networkType];
  }

  stake = async (
    connectedWallet: IConnectedWallet,
    tokenId: string
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "transfer",
      scriptHash: SWAP_SCRIPT_HASH[this.network],
      args: [
        {
          type: "Hash160",
          value: this.contractHash,
        },
        {
          type: "String",
          value: tokenId,
        },
        {
          type: "String",
          value: "1",
        },
      ],
      signers: [getDefaultWitnessScope(senderHash)],
    };
    return NeoWallets.invoke(connectedWallet, this.network, invokeScript);
  };

  remove = async (
    connectedWallet: IConnectedWallet,
    tokenId: string
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "unStake",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: senderHash,
        },
        {
          type: "String",
          value: tokenId,
        },
      ],
      signers: [getDefaultWitnessScope(senderHash)],
    };
    return NeoWallets.invoke(connectedWallet, this.network, invokeScript);
  };

  claim = async (
    connectedWallet: IConnectedWallet,
    tokenA: string,
    tokenB: string
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "claim",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: senderHash,
        },
        {
          type: "Hash160",
          value: tokenA,
        },
        {
          type: "Hash160",
          value: tokenB,
        },
      ],
      signers: [getDefaultWitnessScope(senderHash)],
    };
    return NeoWallets.invoke(connectedWallet, this.network, invokeScript);
  };

  claimMulti = async (
    connectedWallet: IConnectedWallet,
    batch: IClaimableRewards[]
  ) => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "claimMulti",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: senderHash,
        },
        {
          type: "Array",
          value: batch.map((item) => {
            return {
              type: "Array",
              value: [
                {
                  type: "Hash160",
                  value: item.tokenA,
                },
                {
                  type: "Hash160",
                  value: item.tokenB,
                },
              ],
            };
          }),
        },
      ],
      signers: [getDefaultWitnessScope(senderHash)],
    };
    return NeoWallets.invoke(connectedWallet, this.network, invokeScript);
  };

  stakeBoy = async (
    connectedWallet: IConnectedWallet,
    tokenId: string,
    lotNo: string
  ) => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "transfer",
      scriptHash: BOYZ_SCRIPT_HASH[this.network],
      args: [
        {
          type: "Hash160",
          value: this.contractHash,
        },
        {
          type: "String",
          value: tokenId,
        },
        {
          type: "Integer",
          value: lotNo,
        },
      ],
      signers: [getDefaultWitnessScope(senderHash)],
    };
    return NeoWallets.invoke(connectedWallet, this.network, invokeScript);
  };

  UnStakeBoy = async (
    connectedWallet: IConnectedWallet,
    tokenId: string,
    lotNo: string
  ) => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "unStakeBoy",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: senderHash,
        },
        {
          type: "String",
          value: tokenId,
        },
        {
          type: "Integer",
          value: lotNo,
        },
      ],
      signers: [getDefaultWitnessScope(senderHash)],
    };
    return NeoWallets.invoke(connectedWallet, this.network, invokeScript);
  };

  getPools = async (): Promise<IFarmPair[]> => {
    const script = {
      scriptHash: this.contractHash,
      operation: "getPools",
      args: [],
    };
    const res: any = await Network.read(this.network, [script]);
    if (res.state === "FAULT") {
      throw new Error(res.exception ? (res.exception as string) : WENT_WRONG);
    }
    const pools: any = [];

    for (const pair of res.stack[0].value) {
      const pool: IPool = parseMapValue(pair);
      const hasBonusRewards = pool.bonusTokensPerSecond > 0;
      const tokenA = await getTokenByHash(NEO_CHAIN, this.network, pool.tokenA);
      const tokenB = await getTokenByHash(NEO_CHAIN, this.network, pool.tokenB);
      pools.push({
        ...pool,
        iconA: tokenA && tokenA.icon ? tokenA.icon : "",
        iconB: tokenB && tokenB.icon ? tokenB.icon : "",
        symbolA: pool.tokenASymbol,
        symbolB: pool.tokenBSymbol,
        nepRewardsPerDay: withDecimal(pool.nepTokensPerSecond * 86400, 8, true),
        bonusRewardsPerDay: hasBonusRewards
          ? withDecimal(
              pool.bonusTokensPerSecond * 86400,
              pool.bonusTokenDecimals,
              true
            )
          : "0",
        tokensStaked: pool.tokensStaked.toString(),
        nepTokensPerSecond: pool.nepTokensPerSecond.toString(),
        hasBonusRewards,
      });
    }

    return pools;
  };

  getStakedLPTokens = async (address: string): Promise<ILPToken[]> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(address);
    const scripts = [
      {
        scriptHash: this.contractHash,
        operation: "getLPTokens",
        args: [{ type: "Hash160", value: senderHash }],
      },
    ];
    const res: any = await Network.read(this.network, scripts);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    return res.stack[0].value.map((pair) => {
      return parseMapValue(pair);
    });
  };

  getClaimable = async (address: string): Promise<IClaimable> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(address);
    const scripts = [
      {
        scriptHash: this.contractHash,
        operation: "getClaimable",
        args: [{ type: "Hash160", value: senderHash }],
      },
      {
        scriptHash: this.contractHash,
        operation: "getBoyStakingStatus",
        args: [
          {
            type: "Hash160",
            value: senderHash,
          },
        ],
      },
    ];
    const res: any = await Network.read(this.network, scripts);
    if (res.state !== "FAULT") {
      const rewards = res.stack[0].value.map((pair) => {
        return parseMapValue(pair);
      });

      const boyzObj = parseMapValue(res.stack[1]);
      const boyz = [
        {
          lotNo: "1",
          tokenId: boyzObj["1_tokenId"],
          tier: boyzObj["1_tier"],
          createdAt: boyzObj["1_createdAt"],
        },
        {
          lotNo: "2",
          tokenId: boyzObj["2_tokenId"],
          tier: boyzObj["2_tier"],
          createdAt: boyzObj["2_createdAt"],
        },
        {
          lotNo: "3",
          tokenId: boyzObj["3_tokenId"],
          tier: boyzObj["3_tier"],
          createdAt: boyzObj["3_createdAt"],
        },
      ];

      let bonus = 0;
      let team = 0;

      boyz.forEach((b) => {
        if (b.tier === "1") {
          bonus = bonus + 1;
        } else if (b.tier === "2") {
          bonus = bonus + 0.75;
        } else if (b.tier === "3") {
          bonus = bonus + 0.5;
        }
        if (b.tokenId) {
          team++;
        }
      });
      if (team === 3) {
        bonus = bonus + 1;
      }

      return {
        rewards,
        boyz,
        bonus,
        NEPInContract: "Infinite",
      };
    } else {
      return {
        boyz: [],
        rewards: [],
        bonus: 0,
        NEPInContract: "Infinite",
      };
    }
  };

  getBoyStakingStatus = async (
    connectedWallet: IConnectedWallet
  ): Promise<any> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );

    const script = {
      scriptHash: this.contractHash,
      operation: "getBoyStakingStatus",
      args: [
        {
          type: "Hash160",
          value: senderHash,
        },
      ],
    };
    const res = await Network.read(this.network, [script]);
    if (res.state === "FAULT") {
      throw new Error("Failed");
    }
    return parseMapValue(res.stack[0] as any);
  };

  getMarketStatus = async (): Promise<boolean> => {
    const scripts = [
      {
        scriptHash: this.contractHash,
        operation: "getMarketStatus",
        args: [],
      },
    ];
    const res = await Network.read(this.network, scripts);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    return res.stack[0].value as boolean;
  };
}
