import { signTypedData } from "@wagmi/core";
import { splitSignature } from "ethers/lib/utils.js";

export const getPermitSignature = async (
  wallet,
  token,
  spender,
  value,
  deadline
) => {
//   const [nonce, name, version, chainId] = await Promise.all([
//     permitConfig?.nonce ?? token.nonces(wallet.address),
//     permitConfig?.name ?? token.name(),
//     permitConfig?.version ?? "1",
//     permitConfig?.chainId ?? wallet.getChainId(),
//   ]);

//   return splitSignature(
//     await signTypedData({
//       domain: {
//         name,
//         version,
//         chainId,
//         verifyingContract: token.address,
//       },
//       types: {
//         Permit: [
//           {
//             name: "owner",
//             type: "address",
//           },
//           {
//             name: "spender",
//             type: "address",
//           },
//           {
//             name: "value",
//             type: "uint256",
//           },
//           {
//             name: "nonce",
//             type: "uint256",
//           },
//           {
//             name: "deadline",
//             type: "uint256",
//           },
//         ],
//       },
//       value: {
//         owner: wallet.address,
//         spender,
//         value,
//         nonce,
//         deadline,
//       },
//     })
//   );
};
