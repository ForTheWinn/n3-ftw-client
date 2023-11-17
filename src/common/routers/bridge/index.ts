import { BRIDGE_CONTRACTS } from "../../../consts/bridge";
import {
  NEO_MAINNET_CHAIN_ID,
  NEO_TESTNET_CHAIN_ID,
} from "../../../consts/global";
import { INetworkType } from "../../../packages/neo/network";
import { getBridgeFee as getNEOBridgeFee } from "../../../packages/neo/contracts/ftw/bridge";
import { getBridgeFee as getEVMBridgeFee } from "../../../packages/evm/contracts/bridge";

export const getBridgeFee = async (
  originChainId: number,
  destChainId: Number,
  network: INetworkType
) => {
  const contractHash = BRIDGE_CONTRACTS[network][originChainId][destChainId];
  if (
    originChainId === NEO_MAINNET_CHAIN_ID ||
    originChainId === NEO_TESTNET_CHAIN_ID
  ) {
    return getNEOBridgeFee(contractHash, network);
  } else {
    return getEVMBridgeFee(originChainId, contractHash);
  }
};
