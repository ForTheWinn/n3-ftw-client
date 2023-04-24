import { sc, u, wallet } from "@cityofzion/neon-core";
import { BigNumber } from "@ethersproject/bignumber";
import moment from "moment";
import { IBalance } from "../wallets/interfaces";
import {
  StackItemLike,
  StackItemMap
} from "@cityofzion/neon-core/lib/sc/StackItem";

export const truncateAddress = (address: string) => {
  return address
    ? `${address.substring(0, 4)}...${address.substr(address.length - 2)}`
    : "";
};

/**
 * It converts contract call params for dev wallet. Depending on 3rd wallet params.
 * @param param
 */
export const convertContractCallParam = (param: any) => {
  switch (param.type) {
    case "Address":
      return sc.ContractParam.hash160(
        wallet.getScriptHashFromAddress(param.value)
      );
    case "Hash160":
      return sc.ContractParam.hash160(param.value);
    case "String":
      return sc.ContractParam.string(param.value);
    case "Integer":
      return sc.ContractParam.integer(param.value);
    case "Array":
      return sc.ContractParam.array(
        ...param.value.map((i: any) => convertContractCallParam(i))
      );
    case "ByteArray":
      return sc.ContractParam.byteArray(
        u.hex2base64(u.str2hexstring(param.value))
      );
    default:
      throw new Error("No support param");
  }
};

export const base64ToAddress = (str: string): string => {
  try {
    const hash = base64ToHash160(str);
    return wallet.getAddressFromScriptHash(hash);
  } catch (e) {
    return "";
  }
};

export const base64ToHash160 = (str: string): string =>
  "0x" + u.reverseHex(u.base642hex(str));

export const base64ToString = (str: string): string =>
  u.HexString.fromBase64(str).toAscii().toString();

export const base64ToDate = (str: string): string =>
  moment.unix(parseFloat(str) / 1000).format("lll");

export const toDecimal = (val: string | number): number => {
  try {
    return parseFloat(u.BigInteger.fromNumber(val).toDecimal(8));
  } catch (e) {
    return 0;
  }
};

export const withDecimal = (
  num: string | number,
  decimals: number,
  truncated?: boolean
): string => {
  try {
    let val = u.BigInteger.fromNumber(num).toDecimal(decimals);
    if (truncated) {
      return numberTrim(parseFloat(val));
    }
    return val;
  } catch (e) {
    return "";
  }
};

export const decimalCuts = (symbol: string): number => {
  switch (symbol) {
    case "fUSDT":
      return 0;
    case "bNEO":
      return 2;
    case "GAS":
      return 2;
    case "fWBTC":
      return 2;
    case "fWETH":
      return 2;
    case "NEP":
      return 5;
    case "TTM":
      return 5;
    default:
      return 9;
  }
};

export const numberTrim = (no: number, decimals = 2): string => {
  if (!no) return "0";
  return no
    .toFixed(decimals)
    .replace(/[.,]00$/, "")
    .toString();
};

export const balanceCheck = (
  balances: IBalance[],
  requiredAmount: number
): boolean => {
  let hasBalance = false;
  balances.forEach((bal) => {
    if (bal.symbol === "GAS") {
      if (parseFloat(bal.amount) > requiredAmount) {
        hasBalance = true;
      }
    }
  });
  return hasBalance;
};

const stringList = [
  "name",
  "manifest",
  "tokenId",
  "tokenASymbol",
  "tokenBSymbol",
  "symbol",
  "symbolA",
  "symbolB",
  "title",
  "description",
  "author",
  "bonusTokenSymbol",
  "image",
  "1_tokenId",
  "2_tokenId",
  "3_tokenId"
];
const addressList = ["owner", "account", "creator", "receiver"];
const hash160List = [
  "contractHash",
  "tokenA",
  "tokenB",
  "tokenIn",
  "tokenOut",
  "bonusToken",
  "bonusTokenHash"
];
const dateList = ["createdAt", "1_createdAt", "2_createdAt", "3_createdAt"];
const intList = [
  "start",
  "end",
  "deposit",
  "totalItems",
  "totalPages",
  "no",
  "amount",
  "amountA",
  "amountB",
  "amountIn",
  "amountOut",
  "share",
  "totalShare",
  "tokenADecimals",
  "tokenBDecimals",
  "minTokens",
  "claimable",
  "currentAPR",
  "TVL",
  "APR",
  "rewardsPerSecond",
  "rewardsToHarvest",
  "bonusToHarvest",
  "nepTokensPerSecond",
  "bonusTokensPerSecond",
  "tokensStaked",
  "rewardDebt",
  "bonusRewardDebt",
  "accumulatedRewardsPerShare",
  "accumulatedBonusPerShare",
  "lockedAmount",
  "releasedAt",
  "releaseAt",
  "nextDrawingAt",
  "position",
  "startAt",
  "drawNo",
  "totalReward",
  "totalPosition",
  "claimableAmount",
  "sharesPercentage"
];
const classify = (k: string): any => {
  if (addressList.includes(k)) {
    return "address";
  } else if (stringList.includes(k)) {
    return "string";
  } else if (hash160List.includes(k)) {
    return "hash160";
  } else if (intList.includes(k)) {
    return "int";
  } else if (dateList.includes(k)) {
    return "date";
  } else {
    return k;
  }
};

export const parseMapValue = (stackItem: StackItemLike): any => {
  const obj = {};
  const root = stackItem.value as StackItemMap[];
  root.forEach(({ key, value }) => {
    if (value.value !== undefined) {
      const _key = u.base642utf8(key.value as string);
      let val;
      switch (classify(_key)) {
        case "address":
          val = base64ToAddress(value.value as string);
          break;
        case "string":
          val = base64ToString(value.value as string);
          break;
        case "hash160":
          val = base64ToHash160(value.value as string);
          break;
        case "int":
          val = parseFloat(value.value as string);
          break;
        case "date":
          val = base64ToDate(value.value as string);
          break;
        case "options":
          // @ts-ignore
          val = value.value.map((v) => {
            return base64ToString(v.value as string);
          });
          break;
        case "lock":
          val =
            value.value === "0" ? "None" : base64ToDate(value.value as string);
          break;
        case "items":
          // @ts-ignore
          val = value.value.map((item) => {
            return parseMapValue(item);
          });
          break;
        case "positions":
          // @ts-ignore
          val = value.value.map(({ value }) => {
            return parseFloat(value);
          });
          break;
        default:
          val = value.value;
          break;
      }
      obj[_key] = val;
    }
  });
  return obj;
};

export function numberToByteString(num: string) {
  const h = BigNumber.from(num).toHexString().substr(2);
  let hex = h.length % 2 ? "0" + h : h;
  const fc = hex.charAt(0);

  if ((fc > "7" && fc <= "9") || (fc >= "a" && fc <= "f")) {
    hex = "00" + hex;
  }

  return btoa(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    hex
      .match(/.{1,2}/g)!
      .reverse()
      .map((v: any) => String.fromCharCode(parseInt(v, 16)))
      .join("")
  );
}

export const getNEP17TransferScript = (
  scriptHash: string,
  from: string,
  to: string,
  amount: string
) => {
  return {
    operation: "transfer",
    scriptHash: scriptHash,
    args: [
      {
        type: "Hash160",
        value: from
      },
      {
        type: "Hash160",
        value: to
      },
      {
        type: "Integer",
        value: amount
      },
      {
        type: "Any",
        value: null
      }
    ]
  };
};
