import { INetworkType, Network } from "../../../network";
import { IConnectedWallet } from "../../../wallet/interfaces";
import { wallet } from "../../../index";
import { SWAP_SCRIPT_HASH } from "./consts";
import { base64ToString, parseMapValue } from "../../../utils";
import { tx, u, wallet as NeonWallet } from "@cityofzion/neon-core";
import { defaultDeadLine } from "./helpers";
import { DEFAULT_WITNESS_SCOPE } from "../../../consts";
import {
  IContractInfo,
  ILPHistory,
  ILPToken,
  IReserve,
  IReserveData,
  ISwapsHistory,
} from "./interfaces";
import { SMITH_SCRIPT_HASH } from "../smith/consts";
import {
  BNEO_SCRIPT_HASH,
  GAS_SCRIPT_HASH,
  NEO_SCRIPT_HASH,
  NEP_SCRIPT_HASH,
} from "../../../consts/nep17-list";

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
    tokenADecimals: number,
    amountA: number,
    tokenB: string,
    tokenBDecimals: number,
    amountB: number,
    lockUntil: number,
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
          value: u.BigInteger.fromDecimal(amountA, tokenADecimals).toString(),
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
      signers: [
        {
          account: senderHash,
          scopes: tx.WitnessScope.CustomContracts,
          allowedContracts: [this.contractHash, tokenA, tokenB],
        },
      ],
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

	provideWithNEP17Payment = async (
		connectedWallet: IConnectedWallet,
		neoAmount: number,
		tokenB: string,
		tokenBDecimals: number,
		amountB: number,
		lockUntil: number,
		slippage: number
	): Promise<string> => {
		console.log(neoAmount)
		console.log(tokenB)
		console.log(tokenBDecimals)
		console.log(amountB)
		const senderHash = NeonWallet.getScriptHashFromAddress(
			connectedWallet.account.address
		);
		const invokeScript = {
			operation: "transfer",
			scriptHash: NEO_SCRIPT_HASH,
			args: [
				{
					type: "Hash160",
					value: senderHash,
				},
				{
					type: "Hash160",
					value: this.contractHash,
				},
				{
					type: "Integer",
					value: neoAmount,
				},
				{
					type: "Array",
					value: [
						{
							type: "Hash160",
							value: tokenB,
						},
						{
							type: "Integer",
							value: u.BigInteger.fromDecimal(
								amountB,
								tokenBDecimals
							).toString(),
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
				},
			],
			// signers: [
			// 	{
			// 		account: senderHash,
			// 		scopes: tx.WitnessScope.Global,
			// 		// allowedContracts: [this.contractHash, NEO_SCRIPT_HASH, tokenB],
			// 	},
			// ],
			signers: [
				{
					account: senderHash,
					scopes: tx.WitnessScope.WitnessRules,
					rules: [
						{ action: "Allow", condition: { type: "CalledByEntry" } },
						{ action: "Allow", condition: { type: "ScriptHash", hash: tokenB } },
						{ action: "Allow", condition: { type: "ScriptHash", hash: this.contractHash } },
					],
				},
			],
		};
		console.log(invokeScript);
		return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
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
      signers: [DEFAULT_WITNESS_SCOPE(senderHash)],
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  swap = async (
    connectedWallet: IConnectedWallet,
    tokenA: string,
    tokenADecimals: number,
    amountA: number,
    tokenB: string,
    tokenBDecimals: number,
    amountB: number // Slippage
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
          value: u.BigInteger.fromDecimal(amountA, tokenADecimals).toString(),
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
      ],
      signers: [
        {
          account: senderHash,
          scopes: tx.WitnessScope.CustomContracts,
          allowedContracts: [this.contractHash, tokenA],
        },
      ],
    };
    console.log(tokenA);
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  swapWithNEO = async (
    connectedWallet: IConnectedWallet,
    neoAmount: number,
    tokenB: string,
    tokenBDecimals: number,
    slippage: number
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "transfer",
      scriptHash: NEO_SCRIPT_HASH,
      args: [
        {
          type: "Hash160",
          value: senderHash,
        },
        {
          type: "Hash160",
          value: this.contractHash,
        },
        {
          type: "Integer",
          value: neoAmount,
        },
        {
          type: "Array",
          value: [
            {
              type: "Hash160",
              value: tokenB,
            },
            {
              type: "Integer",
              value: u.BigInteger.fromDecimal(
                slippage,
                tokenBDecimals
              ).toString(),
            },
            {
              type: "Integer",
              value: defaultDeadLine(),
            },
          ],
        },
      ],
      signers: [DEFAULT_WITNESS_SCOPE(senderHash)],
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  swapBtoA = async (
    connectedWallet: IConnectedWallet,
    tokenA: string,
    tokenADecimals: number,
    tokenB: string,
    tokenBDecimals: number,
    amountOut: number,
    maxTokenAAmount: number
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
          value: u.BigInteger.fromDecimal(amountOut, tokenBDecimals).toString(),
        },
        {
          type: "Integer",
          value: u.BigInteger.fromDecimal(
            maxTokenAAmount,
            tokenADecimals
          ).toString(),
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
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  swapBWithNEO = async (
    connectedWallet: IConnectedWallet,
    tokenA: string,
    tokenADecimals: number,
    neoOut: number,
    maxTokenAAmount: number
  ): Promise<string> => {
    const senderHash = NeonWallet.getScriptHashFromAddress(
      connectedWallet.account.address
    );
    const invokeScript = {
      operation: "transfer",
      scriptHash: GAS_SCRIPT_HASH,
      args: [
        {
          type: "Hash160",
          value: senderHash,
        },
        {
          type: "Hash160",
          value: this.contractHash,
        },
        {
          type: "Integer",
          value: neoOut * 100000,
        },
        {
          type: "Array",
          value: [
            {
              type: "Hash160",
              value: tokenA,
            },
            {
              type: "Integer",
              value: u.BigInteger.fromDecimal(
                maxTokenAAmount,
                tokenADecimals
              ).toString(),
            },
            {
              type: "Integer",
              value: defaultDeadLine(),
            },
          ],
        },
      ],
      signers: [
        // {
        //   account: senderHash,
        //   scopes: tx.WitnessScope.CustomContracts,
        //   allowedContracts: [tokenA],
        // },
        {
          account: senderHash,
          scopes: tx.WitnessScope.WitnessRules,
          rules: [
            { action: "Allow", condition: { type: "CalledByEntry" } },
            { action: "Allow", condition: { type: "ScriptHash", hash: tokenA } },
            { action: "Allow", condition: { type: "ScriptHash", hash: this.contractHash } },
          ],
          // allowedContracts: [this.contractHash, tokenA],
        },
        // {
        //   account: this.contractHash,
        //   scopes: tx.WitnessScope.CalledByEntry,
        // }
      ],
    };
    return wallet.WalletAPI.invoke(connectedWallet, this.network, invokeScript);
  };

  getReserve = async (
    tokenA: string,
    tokenB: string,
    connectedWallet?: IConnectedWallet
  ): Promise<IReserveData> => {
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
    if (connectedWallet) {
      const script1 = {
        scriptHash: tokenA,
        operation: "balanceOf",
        args: [{ type: "Address", value: connectedWallet.account.address }],
      };
      const script2 = {
        scriptHash: tokenB,
        operation: "balanceOf",
        args: [{ type: "Address", value: connectedWallet.account.address }],
      };
      scripts.push(script1);
      scripts.push(script2);
    }
    const res = await Network.read(this.network, scripts);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    const pair: any = parseMapValue(res.stack[0] as any);
    const obj = {
      // reserve: pair,
      pair: {
        [pair.tokenA]: {
          symbol: pair.tokenASymbol,
          decimals: pair.tokenADecimals,
          reserveAmount: pair.amountA,
        },
        [pair.tokenB]: {
          symbol: pair.tokenBSymbol,
          decimals: pair.tokenBDecimals,
          reserveAmount: pair.amountB,
        },
      },
      totalShare: pair.totalShare,
      userBalances: {
        [tokenA]: 0,
        [tokenB]: 0,
      },
    };
    if (connectedWallet) {
      obj.userBalances[tokenA] = parseFloat(
        u.BigInteger.fromNumber(res.stack[1].value as string).toDecimal(
          obj.pair[tokenA].decimals
        )
      );

      obj.userBalances[tokenB] = parseFloat(
        u.BigInteger.fromNumber(res.stack[2].value as string).toDecimal(
          obj.pair[tokenB].decimals
        )
      );
    }
    return obj;
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
    swapTokenDecimals,
    amount
  ): Promise<string> => {
    console.log(swapTokenDecimals);
    const script = {
      scriptHash: this.contractHash,
      operation: "getSwapEstimate",
      args: [
        { type: "Hash160", value: tokenA },
        { type: "Hash160", value: tokenB },
        { type: "Hash160", value: swapToken },
        {
          type: "Integer",
          value: u.BigInteger.fromDecimal(amount, swapTokenDecimals).toString(),
        },
      ],
    };
    const res = await Network.read(this.network, [script]);
    console.log(res);
    if (res.state === "FAULT") {
      return "0";
    } else {
      const { estimated, fee, decimals } = parseMapValue(res.stack[0] as any);
      console.log(
        "Fee: " + u.BigInteger.fromNumber(fee).toDecimal(swapTokenDecimals)
      );
      return u.BigInteger.fromNumber(estimated).toDecimal(decimals);
    }
  };

  getSwapBEstimate = async (
    tokenA,
    tokenB,
    tokenBDecimals,
    amountOut
  ): Promise<string> => {
    const script = {
      scriptHash: this.contractHash,
      operation: "getSwapBEstimate",
      args: [
        { type: "Hash160", value: tokenA },
        { type: "Hash160", value: tokenB },
        {
          type: "Integer",
          value: u.BigInteger.fromDecimal(amountOut, tokenBDecimals).toString(),
        },
      ],
    };
    const res = await Network.read(this.network, [script]);
    if (res.state === "FAULT") {
      return "0";
    } else {
      const { estimated, decimals } = parseMapValue(res.stack[0] as any);
      return u.BigInteger.fromNumber(estimated).toDecimal(decimals);
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
            { type: "Hash160", value: BNEO_SCRIPT_HASH[this.network] },
            { type: "Hash160", value: NEP_SCRIPT_HASH[this.network] },
            { type: "Hash160", value: BNEO_SCRIPT_HASH[this.network] },
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
    const smithContractHash = SMITH_SCRIPT_HASH[this.network];
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

  getProperties = async (tokenId: string): Promise<object | null> => {
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
      throw new Error(res.exception as string);
    }
    return parseMapValue(res.stack[0] as any);
  };

  getLPTokens = async (
    connectedWallet: IConnectedWallet
  ): Promise<ILPToken> => {
    const scripts = [
      {
        scriptHash: this.contractHash,
        operation: "getLPTokensByUser",
        args: [{ type: "Address", value: connectedWallet.account.address }],
      },
    ];
    const res = await Network.read(this.network, scripts);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    // @ts-ignore
    return res.stack[0].value.map((item) => parseMapValue(item));
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

    const scripts = [
      {
        scriptHash: NEO_SCRIPT_HASH,
        operation: "balanceOf",
        args: [{ type: "Address", value: connectedWallet.account.address }],
      },
      {
        scriptHash: BNEO_SCRIPT_HASH[this.network],
        operation: "balanceOf",
        args: [{ type: "Address", value: connectedWallet.account.address }],
      },
    ];
    const res = await Network.read(this.network, scripts);
    if (res.state === "FAULT") {
      throw new Error(res.exception as string);
    }
    // @ts-ignore
    return {
      neo: parseFloat(res.stack[0].value as string),
      bNEO: parseFloat(
        u.BigInteger.fromNumber(res.stack[1].value as string).toDecimal(8)
      ),
    };
  };
}
