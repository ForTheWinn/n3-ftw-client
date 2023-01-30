import { POSClient, use } from "@maticnetwork/maticjs";
import { Web3ClientPlugin } from "@maticnetwork/maticjs-web3";

// install web3 plugin
use(Web3ClientPlugin);

// const posClient = new POSClient();
export const posClient = () => new POSClient().init({
  network: "testnet",
  version: "mumbai",
//   parent: {
//     provider: new HDWalletProvider(privateKey, mainRPC),
//     defaultConfig: {
//       from: fromAddress,
//     },
//   },
//   child: {
//     provider: new HDWalletProvider(privateKey, childRPC),
//     defaultConfig: {
//       from: fromAddress,
//     },
//   },
});
