import { wallet } from "@cityofzion/neon-core";
import { INetworkType, Network } from "../network";
import { ethers } from "ethers";

export const useBalances = async (
  network: INetworkType,
  address: string,
  tokens: string[]
) => {
  const ownerHash = wallet.getScriptHashFromAddress(address);
  const scripts: any = [];
  for (const token of tokens) {
    scripts.push({
      scriptHash: token,
      operation: "balanceOf",
      args: [
        {
          type: "Hash160",
          value: ownerHash,
        },
      ],
    });
    scripts.push({
      scriptHash: token,
      operation: "decimals",
      args: [],
    });
  }

  const res = await Network.read(network, scripts);
  if (res.state === "FAULT") {
    throw new Error(res.exception as string);
  }
  const balances: number[] = [];

  res.stack.forEach((item, index) => {
    if (index % 2 === 0) {
      balances.push(
        parseFloat(
          ethers
            .formatUnits(
              item.value as string,
              res.stack[index + 1].value as string
            )
            .toString()
        )
      );
    }
  });
  return balances;
};
