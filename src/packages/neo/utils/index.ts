import { sc, u, wallet } from "@cityofzion/neon-core";
import moment from "moment";
import { IBalance } from "../wallet/interfaces";
import {
  StackItemLike,
  StackItemMap,
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

export const base64ToAddress = (str: string): string =>
  wallet.getAddressFromScriptHash(base64ToHash160(str));

export const base64ToHash160 = (str: string): string =>
  u.reverseHex(u.base642hex(str));

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
  let val = u.BigInteger.fromNumber(num).toDecimal(decimals);
  if (truncated) {
    return numberTrim(parseFloat(val));
  }
  return val;
};

export const numberTrim = (no: number, decimals = 2): string => {
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
	"bonusTokenSymbol"
];
const addressList = ["owner", "account", "creator"];
const hash160List = ["contractHash", "tokenA", "tokenB", "tokenIn", "tokenOut", "bonusToken", "bonusTokenHash"];
const dateList = ["createdAt"];
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
        default:
          val = value.value;
          break;
      }
      obj[_key] = val;
    }
  });
  return obj;
};
