import { INetworkType, Network } from "../../../network";
import { IConnectedWallet } from "../../../wallets/interfaces";
import { SWAP_SCRIPT_HASH } from "./consts";
import { base64ToString, parseMapValue, toDecimal } from "../../../utils";
import { tx, u, wallet as NeonWallet } from "@cityofzion/neon-core";
import { defaultDeadLine } from "./helpers";
import { getDefaultWitnessScope } from "../../../utils";
import {
  IContractInfo,
  ILPHistory,
  ILPToken,
  IReserve,
  ISwapsHistory,
} from "./interfaces";
import {
  NEO_BNEO_CONTRACT_ADDRESS,
  NEO_GAS_CONTRACT_ADDRESS,
  NEO_NEO_CONTRACT_ADDRESS,
  NEO_NEP_CONTRACT_ADDRESS,
} from "../../../consts/tokens";
import {
  ISwapLPToken,
  ISwapReserves,
} from "../../../../../common/routers/swap/interfaces";
import { WENT_WRONG } from "../../../../../consts/messages";
import { CONTRACT_LIST } from "../../../consts";
import { SMITH } from "../../../../../consts/global";
import { NeoWallets } from "../../../wallets";

export class SwapContract {
  network: INetworkType;
  contractHash: string;

  constructor(networkType: INetworkType) {
    this.network = networkType;
    this.contractHash = SWAP_SCRIPT_HASH[networkType];
  }

  provide = async (
    connectedWallet: IConnectedWallet,
    tokenA: string,
    amountA: string,
    tokenB: string,
    amountB: string,
    lockUntil: Date | undefined,
    slippage: number
  ): Promise<string> => {

    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "addLiquidity",
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
          type: "Integer",
          value: amountA,
        },
        {
          type: "Hash160",
          value: tokenB,
        },
        {
          type: "Integer",
          value: amountB,
        },
        {
          type: "Integer",
          value: defaultDeadLine(),
        },
        {
          type: "Integer",
          value: lockUntil ? lockUntil.getTime().toString() : 0,
        },
        {
          type: "Integer",
          value: slippage,
        },
      ],
      signers: [
        {
          account: senderHash,
          scopes: tx.WitnessScope.CustomContracts,
          allowedContracts: [this.contractHash, tokenA, tokenB],
        },
      ],
    };
    return NeoWallets.invoke(connectedWallet, this.network, invokeScript);
  };

  provideWithNEO = async (
    connectedWallet: IConnectedWallet,
    neoAmount: number,
    tokenB: string,
    tokenBDecimals: number,
    amountB: number,
    lockUntil: number,
    slippage: number
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );

    const bNEOHash = NEO_BNEO_CONTRACT_ADDRESS[this.network];

    const bNEOScript = {
      operation: "transfer",
      scriptHash: NEO_NEO_CONTRACT_ADDRESS,
      args: [
        {
          type: "Hash160",
          value: senderHash,
        },
        {
          type: "Hash160",
          value: bNEOHash,
        },
        {
          type: "Integer",
          value: neoAmount,
        },
        {
          type: "Any",
          value: null,
        },
      ],
    };

    const addLiquidityScript = {
      operation: "addLiquidity",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: senderHash,
        },
        {
          type: "Hash160",
          value: bNEOHash,
        },
        {
          type: "Integer",
          value: neoAmount * 100000000,
        },
        {
          type: "Hash160",
          value: tokenB,
        },
        {
          type: "Integer",
          value: u.BigInteger.fromDecimal(amountB, tokenBDecimals).toString(),
        },
        {
          type: "Integer",
          value: defaultDeadLine(),
        },
        {
          type: "Integer",
          value: lockUntil,
        },
        {
          type: "Integer",
          value: slippage,
        },
      ],
    };

    const signers = [
      {
        account: senderHash,
        scopes: tx.WitnessScope.WitnessRules,
        rules: [
          { action: "Allow", condition: { type: "CalledByEntry" } },
          {
            action: "Allow",
            condition: { type: "ScriptHash", hash: bNEOHash },
          },
          {
            action: "Allow",
            condition: { type: "ScriptHash", hash: tokenB },
          },
        ],
      },
    ];

    return NeoWallets.invokeMulti(
      connectedWallet,
      this.network,
      [bNEOScript, addLiquidityScript],
      signers
    );
  };

  remove = async (
    connectedWallet: IConnectedWallet,
    tokenId: string
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "removeLiquidity",
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
          value: defaultDeadLine(),
        },
      ],
      signers: [getDefaultWitnessScope(senderHash)],
    };
    return NeoWallets.invoke(connectedWallet, this.network, invokeScript);
  };

  swap = async (
    connectedWallet: IConnectedWallet,
    tokenA: string,
    amountA: string,
    tokenB: string,
    amountB: string // Min amount out
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "swap",
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
          type: "Integer",
          value: amountA,
        },
        {
          type: "Hash160",
          value: tokenB,
        },
        {
          type: "Integer",
          value: amountB,
        },
        {
          type: "Integer",
          value: defaultDeadLine(),
        },
      ],
      signers: [
        {
          account: senderHash,
          scopes: tx.WitnessScope.CustomContracts,
          allowedContracts: [this.contractHash, tokenA],
        },
      ],
    };
    return NeoWallets.invoke(connectedWallet, this.network, invokeScript);
  };

  swapWithNEO = async (
    connectedWallet: IConnectedWallet,
    neoAmount: string,
    tokenB: string,
    amountB: string // Slippage
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const bNEOHash = NEO_BNEO_CONTRACT_ADDRESS[this.network];
    const bNEOScript = {
      operation: "transfer",
      scriptHash: NEO_NEO_CONTRACT_ADDRESS,
      args: [
        {
          type: "Hash160",
          value: senderHash,
        },
        {
          type: "Hash160",
          value: bNEOHash,
        },
        {
          type: "Integer",
          value: neoAmount,
        },
        {
          type: "Any",
          value: null,
        },
      ],
    };

    const swapScript = {
      operation: "swap",
      scriptHash: this.contractHash,
      args: [
        {
          type: "Hash160",
          value: senderHash,
        },
        {
          type: "Hash160",
          value: bNEOHash,
        },
        {
          type: "Integer",
          value: u.BigInteger.fromDecimal(neoAmount, 8).toString(),
        },
        {
          type: "Hash160",
          value: tokenB,
        },
        {
          type: "Integer",
          value: amountB,
        },
        {
          type: "Integer",
          value: defaultDeadLine(),
        },
      ],
    };

    const signers = [
      {
        account: senderHash,
        scopes: tx.WitnessScope.WitnessRules,
        rules: [
          { action: "Allow", condition: { type: "CalledByEntry" } },
          {
            action: "Allow",
            condition: { type: "ScriptHash", hash: bNEOHash },
          },
        ],
      },
    ];

    return NeoWallets.invokeMulti(
      connectedWallet,
      this.network,
      [bNEOScript, swapScript],
      signers
    );
  };

  swapBtoA = async (
    connectedWallet: IConnectedWallet,
    tokenA: string,
    tokenB: string,
    amountOut: string,
    maxTokenAAmount: bigint
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "swapB",
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
        {
          type: "Integer",
          value: Number(amountOut),
        },
        {
          type: "Integer",
          value: Number(maxTokenAAmount),
        },
        {
          type: "Integer",
          value: defaultDeadLine(),
        },
      ],
      signers: [
        {
          account: senderHash,
          scopes: tx.WitnessScope.CustomContracts,
          allowedContracts: [this.contractHash, tokenA],
        },
      ],
    };
    return NeoWallets.invoke(connectedWallet, this.network, invokeScript);
  };

  swapBWithNEO = async (
    connectedWallet: IConnectedWallet,
    tokenA: string,
    neoOut: string,
    maxTokenAAmount: string // Slippage
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );

    const bNEOHash = NEO_BNEO_CONTRACT_ADDRESS[this.network];
    const swapScript = {
      operation: "swapB",
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
          value: bNEOHash,
        },
        {
          type: "Integer",
          value: u.BigInteger.fromDecimal(neoOut, 8).toString(),
        },
        {
          type: "Integer",
          value: maxTokenAAmount,
        },
        {
          type: "Integer",
          value: defaultDeadLine(),
        },
      ],
    };

    const bNEOScript = {
      operation: "transfer",
      scriptHash: NEO_GAS_CONTRACT_ADDRESS,
      args: [
        {
          type: "Hash160",
          value: senderHash,
        },
        {
          type: "Hash160",
          value: bNEOHash,
        },
        {
          type: "Integer",
          value: parseFloat(neoOut) * 100000,
        },
        {
          type: "Any",
          value: null,
        },
      ],
    };
    const signers = [
      {
        account: senderHash,
        scopes: tx.WitnessScope.WitnessRules,
        rules: [
          { action: "Allow", condition: { type: "CalledByEntry" } },
          {
            action: "Allow",
            condition: { type: "ScriptHash", hash: tokenA },
          },
        ],
      },
    ];

    return NeoWallets.invokeMulti(
      connectedWallet,
      this.network,
      [swapScript, bNEOScript],
      signers
    );
  };

  getReserve = async (
    tokenA: string,
    tokenB: string
  ): Promise<ISwapReserves> => {
    const scripts: any = [];
    const script = {
      scriptHash: this.contractHash,
      operation: "getReserve",
      args: [
        { type: "Hash160", value: tokenA },
        { type: "Hash160", value: tokenB },
      ],
    };
    scripts.push(script);

    const res = await Network.read(this.network, scripts);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    const reserves: any = parseMapValue(res.stack[0] as any);
    // Neo swap changes its order at contract level.
    return {
      reserveA: reserves.amountA.toString(),
      reserveB: reserves.amountB.toString(),
      shares: reserves.totalShare.toString(),
    };
  };

  getPairs = async (): Promise<IReserve[]> => {
    const script = {
      scriptHash: this.contractHash,
      operation: "getPairs",
      args: [],
    };
    const res = await Network.read(this.network, [script]);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    // @ts-ignore
    return res.stack[0].value.map((item) => parseMapValue(item));
  };

  // Swap estimate
  getSwapEstimate = async (
    tokenA,
    tokenB,
    swapToken,
    amount
  ): Promise<string> => {
    const script = {
      scriptHash: this.contractHash,
      operation: "getSwapEstimate",
      args: [
        { type: "Hash160", value: tokenA },
        { type: "Hash160", value: tokenB },
        { type: "Hash160", value: swapToken },
        {
          type: "Integer",
          value: amount,
        },
      ],
    };
    const res = await Network.read(this.network, [script]);

    if (res.state === "FAULT") {
      return "0";
    } else {
      const { estimated } = parseMapValue(res.stack[0] as any);
      return estimated;
    }
  };

  getSwapBEstimate = async (
    tokenA: string,
    tokenB: string,
    amountOut: string
  ): Promise<string> => {
    const script = {
      scriptHash: this.contractHash,
      operation: "getSwapBEstimate",
      args: [
        { type: "Hash160", value: tokenA },
        { type: "Hash160", value: tokenB },
        {
          type: "Integer",
          value: amountOut,
        },
      ],
    };
    const res = await Network.read(this.network, [script]);
    if (res.state === "FAULT") {
      return "0";
    } else {
      const { estimated } = parseMapValue(res.stack[0] as any);
      return estimated;
    }
  };

  getLPEstimate = (
    amount: string,
    Adecimals: number,
    Bdecimals: number,
    reserveAAmount: number,
    reserveBAmount: number
  ): string => {
    const tokenAAmount = u.BigInteger.fromDecimal(amount, Adecimals);
    let estimated = tokenAAmount.mul(reserveBAmount).div(reserveAAmount);
    return estimated.toDecimal(Bdecimals);
  };

  getPathEstimated = async (): Promise<number> => {
    const script = {
      scriptHash: this.contractHash,
      operation: "getEstimatedWithPath",
      args: [
        {
          type: "Array",
          value: [
            { type: "Hash160", value: NEO_BNEO_CONTRACT_ADDRESS[this.network] },
            { type: "Hash160", value: NEO_NEP_CONTRACT_ADDRESS[this.network] },
            { type: "Hash160", value: NEO_BNEO_CONTRACT_ADDRESS[this.network] },
          ],
        },
        { type: "Integer", value: 10000000 },
      ],
    };
    const res = await Network.read(this.network, [script]);
    return res.stack[0].value as number;
  };

  getSwapHistory = async (
    tokenA: string,
    tokenB: string,
    page: number
  ): Promise<ISwapsHistory> => {
    const script = {
      scriptHash: this.contractHash,
      operation: "getSwaps",
      args: [
        { type: "Hash160", value: tokenA },
        { type: "Hash160", value: tokenB },
        { type: "Integer", value: "15" },
        { type: "Integer", value: page },
      ],
    };
    const symbolA = {
      scriptHash: tokenA,
      operation: "symbol",
      args: [],
    };
    const decimalsA = {
      scriptHash: tokenA,
      operation: "decimals",
      args: [],
    };
    const symbolB = {
      scriptHash: tokenB,
      operation: "symbol",
      args: [],
    };
    const decimalsB = {
      scriptHash: tokenB,
      operation: "decimals",
      args: [],
    };
    const res = await Network.read(this.network, [
      script,
      symbolA,
      decimalsA,
      symbolB,
      decimalsB,
    ]);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    return {
      ...parseMapValue(res.stack[0] as any),
      pair: {
        [tokenA]: {
          symbol: base64ToString(res.stack[1].value as string),
          decimals: parseFloat(res.stack[2].value as string),
        },
        [tokenB]: {
          symbol: base64ToString(res.stack[3].value as string),
          decimals: parseFloat(res.stack[4].value as string),
        },
      },
    };
  };

  getLPList = async (
    tokenA: string,
    tokenB: string,
    page: number
  ): Promise<ILPHistory> => {
    const script = {
      scriptHash: this.contractHash,
      operation: "getLPs",
      args: [
        { type: "Hash160", value: tokenA },
        { type: "Hash160", value: tokenB },
        { type: "Integer", value: "15" },
        { type: "Integer", value: page },
      ],
    };
    const symbolA = {
      scriptHash: tokenA,
      operation: "symbol",
      args: [],
    };
    const decimalsA = {
      scriptHash: tokenA,
      operation: "decimals",
      args: [],
    };
    const symbolB = {
      scriptHash: tokenB,
      operation: "symbol",
      args: [],
    };
    const decimalsB = {
      scriptHash: tokenB,
      operation: "decimals",
      args: [],
    };
    const res = await Network.read(this.network, [
      script,
      symbolA,
      decimalsA,
      symbolB,
      decimalsB,
    ]);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    return {
      ...parseMapValue(res.stack[0] as any),
      pair: {
        [tokenA]: {
          symbol: base64ToString(res.stack[1].value as string),
          decimals: parseFloat(res.stack[2].value as string),
        },
        [tokenB]: {
          symbol: base64ToString(res.stack[3].value as string),
          decimals: parseFloat(res.stack[4].value as string),
        },
      },
    };
  };

  getContractInfo = async (contractHash: string): Promise<IContractInfo> => {
    const smithContractHash = CONTRACT_LIST[this.network][SMITH];
    const script1 = {
      scriptHash: contractHash,
      operation: "symbol",
      args: [],
    };
    const script2 = {
      scriptHash: contractHash,
      operation: "decimals",
      args: [],
    };
    const script3 = {
      scriptHash: smithContractHash,
      operation: "isWhitelisted",
      args: [
        {
          type: "Hash160",
          value: contractHash,
        },
      ],
    };
    const res = await Network.read(this.network, [script1, script2, script3]);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    return {
      contractHash,
      symbol: base64ToString(res.stack[0].value as string),
      decimals: parseFloat(res.stack[1].value as string),
      isWhitelisted: res.stack[2].value as boolean,
    };
  };

  getProperties = async (tokenId: string): Promise<ISwapLPToken> => {
    const script = {
      scriptHash: this.contractHash,
      operation: "properties",
      args: [
        {
          type: "String",
          value: tokenId,
        },
      ],
    };
    const res = await Network.read(this.network, [script]);
    if (res.state === "FAULT") {
      throw new Error(res.exception ? (res.exception as string) : WENT_WRONG);
    }
    const token = parseMapValue(res.stack[0] as any);
    return {
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
      lock: token.lock,
      image: token.image
    };
  };

  getLPTokens = async (address: string): Promise<ISwapLPToken[]> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(address);
    const scripts = [
      {
        scriptHash: this.contractHash,
        operation: "getLPTokensByUser",
        args: [{ type: "Hash160", value: senderHash }],
      },
    ];
    const res = await Network.read(this.network, scripts);
    if (
      res.state === "FAULT" ||
      !res.stack[0] ||
      !res.stack[0].value ||
      !Array.isArray(res.stack[0].value)
    ) {
      throw new Error(res.exception ? res.exception : WENT_WRONG);
    }

    const tokens: ISwapLPToken[] = [];
    const parsed = res.stack[0].value.map((item: any) => parseMapValue(item));

    for (const token of parsed) {
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
        lock: token.lock,
      });
    }
    return tokens;
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

  getNEObNEOBalance = async (
    connectedWallet?: IConnectedWallet
  ): Promise<{
    neo: number;
    bNEO: number;
  }> => {
    if (!connectedWallet) {
      return {
        neo: 0,
        bNEO: 0,
      };
    }
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const scripts = [
      {
        scriptHash: NEO_NEO_CONTRACT_ADDRESS,
        operation: "balanceOf",
        args: [{ type: "Hash160", value: senderHash }],
      },
      {
        scriptHash: NEO_BNEO_CONTRACT_ADDRESS[this.network],
        operation: "balanceOf",
        args: [{ type: "Hash160", value: senderHash }],
      },
    ];
    const res = await Network.read(this.network, scripts);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    // @ts-ignore
    return {
      neo: parseFloat(res.stack[0].value as string),
      bNEO: toDecimal(res.stack[1].value as string),
    };
  };

  mintBNEO = async (
    connectedWallet: IConnectedWallet,
    neoAmount: string
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const script = {
      operation: "transfer",
      scriptHash: NEO_NEO_CONTRACT_ADDRESS,
      args: [
        {
          type: "Hash160",
          value: senderHash,
        },
        {
          type: "Hash160",
          value: NEO_BNEO_CONTRACT_ADDRESS[this.network],
        },
        {
          type: "Integer",
          value: neoAmount,
        },
        {
          type: "Any",
          value: null,
        },
      ],
      signers: [getDefaultWitnessScope(senderHash)],
    };
    return await NeoWallets.invoke(connectedWallet, this.network, script);
  };

  burnBNEO = async (
    connectedWallet: IConnectedWallet,
    neoAmount: string
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const script = {
      operation: "transfer",
      scriptHash: NEO_GAS_CONTRACT_ADDRESS,
      args: [
        {
          type: "Hash160",
          value: senderHash,
        },
        {
          type: "Hash160",
          value: NEO_BNEO_CONTRACT_ADDRESS[this.network],
        },
        {
          type: "Integer",
          value: parseFloat(neoAmount) * 100000,
        },
        {
          type: "Any",
          value: null,
        },
      ],
      signers: [getDefaultWitnessScope(senderHash)],
    };
    return await NeoWallets.invoke(connectedWallet, this.network, script);
  };
}
