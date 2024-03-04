import { INetworkType, Network } from "../../../network";
import { IConnectedWallet } from "../../../wallets/interfaces";
import { tx, wallet as NeonWallet } from "@cityofzion/neon-core";
import { parseMapValue, readNeoContract } from "../../../utils";
import {
  IBridgeBurnPagenate,
  IBridgeMintPagenate,
} from "../../../../../common/routers/bridge/interfaces";
import { ApplicationLogJson } from "@cityofzion/neon-core/lib/rpc";
import { NEO_NEP_CONTRACT_ADDRESS } from "../../../consts/tokens";
import { ethers } from "ethers";
import { WalletAPI } from "../../../wallets";

export const bridgeMint = async (
  connectedWallet: IConnectedWallet,
  bridgeContractHash: string,
  network: INetworkType,
  neoTokenAddress: string,
  receiver: string,
  amount: string
): Promise<string> => {
  const senderHash = NeonWallet.getScriptHashFromAddress(
    connectedWallet.account.address
  );
  const invokeScript = {
    operation: "mint",
    scriptHash: bridgeContractHash,
    args: [
      {
        type: "Hash160",
        value: neoTokenAddress,
      },
      {
        type: "Hash160",
        value: senderHash,
      },
      {
        type: "Hash160",
        value: receiver,
      },
      {
        type: "Integer",
        value: amount,
      },
    ],
    signers: [
      {
        account: senderHash,
        scopes: tx.WitnessScope.CustomContracts,
        allowedContracts: [
          bridgeContractHash,
          neoTokenAddress,
          NEO_NEP_CONTRACT_ADDRESS[network],
        ],
      },
    ],
  };
  return WalletAPI.invoke(connectedWallet, network, invokeScript);
};

export const getMints = async (
  bridgeContractHash: string,
  network: INetworkType,
  page: number
): Promise<IBridgeMintPagenate> => {
  const script = {
    scriptHash: bridgeContractHash,
    operation: "getMints",
    args: [
      {
        type: "Integer",
        value: "30",
      },
      {
        type: "Integer",
        value: page,
      },
    ],
  };
  const res = await Network.read(network, [script]);
  if (res.state === "FAULT") {
    throw new Error(res.exception as string);
  }
  return parseMapValue(res.stack[0] as any);
};

export const getBurns = async (
  bridgeContractHash: string,
  network: INetworkType,
  page: number
): Promise<IBridgeBurnPagenate> => {
  const script = {
    scriptHash: bridgeContractHash,
    operation: "getBurns",
    args: [
      {
        type: "Integer",
        value: "30",
      },
      {
        type: "Integer",
        value: page,
      },
    ],
  };
  const res = await Network.read(network, [script]);
  if (res.state === "FAULT") {
    throw new Error(res.exception as string);
  }
  return parseMapValue(res.stack[0] as any);
};

export const getMintNo = async (
  network: INetworkType,
  address: string
): Promise<number> => {
  const script = {
    scriptHash: address,
    operation: "getMintNo",
    args: [],
  };
  const res = await Network.read(network, [script]);
  if (res.state === "FAULT") {
    throw new Error(res.exception as string);
  }
  return parseFloat(res.stack[0].value as string);
};

export const getIsMinted = async (
  network: INetworkType,
  address: string
): Promise<number> => {
  const script = {
    scriptHash: address,
    operation: "getMintNo",
    args: [],
  };
  const res = await Network.read(network, [script]);
  if (res.state === "FAULT") {
    throw new Error(res.exception as string);
  }
  return parseFloat(res.stack[0].value as string);
};

export const isBurned = async (
  rpc: string,
  address: string,
  no: string | number
): Promise<boolean> => {
  const script = {
    scriptHash: address,
    operation: "getBurn",
    args: [
      {
        type: "Integer",
        value: no,
      },
    ],
  };
  let isBurned = false;
  do {
    try {
      const res = await readNeoContract(rpc, [script]);
      if (res.state === "HALT") {
        isBurned = true;
      }
    } catch (e) {
      await Network.sleep(3000);
    }
  } while (!isBurned);

  return true;
};

export const getMintNoFromNotifications = (
  json: ApplicationLogJson
): number => {
  let mintNo;
  try {
    json.executions[0].notifications.forEach((log) => {
      if (log.eventname === "Mint" && log.state.value) {
        mintNo = parseFloat(log.state.value[0].value as string);
      }
    });
  } catch (e) {
    throw Error("Can't find mint no from the txid.");
  }
  if (mintNo) {
    return mintNo;
  } else {
    throw Error("Can't find mint no from the txid.");
  }
};

export const getBridgeFee = async (
  bridgeContractHash: string,
  network: INetworkType
): Promise<string> => {
  const script = {
    scriptHash: bridgeContractHash,
    operation: "getFeeAmount",
    args: [],
  };
  const res = await Network.read(network, [script]);
  if (res.state === "FAULT") {
    throw new Error(res.exception as string);
  }
  return ethers.formatUnits(res.stack[0].value as string, 8);
};
