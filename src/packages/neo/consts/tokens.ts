import { CONST as NEON_CONST } from "@cityofzion/neon-core";
import { MAINNET, NEO_CHAIN, NEO_LOGO, TESTNET } from "../../../consts/global";
import { createTokenMetadata } from "../../../common/helpers";

/* Contract hashes */
export const NEO_GAS_CONTRACT_ADDRESS = `0x${NEON_CONST.NATIVE_CONTRACT_HASH.GasToken}`;
export const NEO_NEO_CONTRACT_ADDRESS = `0x${NEON_CONST.NATIVE_CONTRACT_HASH.NeoToken}`;
const NEO_USDT_CONTRACT_ADDRESS = "0xcd48b160c1bbc9d74997b803b9a7ad50a4bef020";
const NEO_FWBTC_CONTRACT_ADDRESS = "0xd6abe115ecb75e1fa0b42f5e85934ce8c1ae2893";
const NEO_FWETH_CONTRACT_ADDRESS = "0xc14b601252aa5dfa6166cf35fe5ccd2e35f3fdf5";

/* TTM HASHES */
const NEO_WATT_CONTRACT_ADDRESS = "0x9808fbad45ebca4abe7b4adf1fd4e1f399d0cc22";
const NEO_LITH_CONTRACT_ADDRESS = "0x4b9006e32173ba357b0696a492b85b85b2016ac4";
const NEO_MAG_CONTRACT_ADDRESS = "0x19557ae882c5007d5fd3634cd499387b8441360c";
const NEO_HIST_CONTRACT_ADDRESS = "0xaf348a1ff998291cbf207fd6ba342da74593599f";
const NEO_TGAS_CONTRACT_ADDRESS = "0x56199aa066633745de4d603e6477881455c08243";
const NEO_TTM_CONTRACT_ADDRESS = "0xc0283310a5117b9d007941e8a0dc3dae9593f65c";

const NEO_FTW_CONTRACT_ADDRESS = {
  [TESTNET]: "0xc1a56650f12420405c5b7e2634eb3779a0c3e396",
  [MAINNET]: "0x9f8b20c31bb9e45003f2d9f316d2caf1dcd1bf20",
};

export const NEO_BNEO_CONTRACT_ADDRESS = {
  [TESTNET]: "0x85deac50febfd93988d3f391dea54e8289e43e9e",
  [MAINNET]: "0x48c40d4666f93408be1bef038b6722404d9a4c2a",
};

export const NEO_NEP_CONTRACT_ADDRESS = {
  [TESTNET]: "0x6f50289324428858794b384b2d57dce49959b95f",
  [MAINNET]: "0xf853a98ac55a756ae42379a312d55ddfdf7c8514",
};

/* Smith contracts */
const NEO_NUDES_CONTRACT_ADDRESS = "0x340720c7107ef5721e44ed2ea8e314cce5c130fa";
const NEO_MAXI_CONTRACT_ADDRESS = "0x5afb6804ee3598a58f8a0994b1df99d8be43a313";
const NEO_TED_CONTRACT_ADDRESS = "0x50b41a55c1d746eec2b86b8f0405fb49fbb96492";
const NEO_N3F_CONTRACT_ADDRESS = "0x979b839648d215fe895d559019dedde31fcf45a9";
const NEO_FRANK_CONTRACT_ADDRESS = "0xa06cfd7ae9dd7befb7bf8e5b8c5902c969182de0";
const NEO_HOOD_CONTRACT_ADDRESS = "0xc8d56cac2dd82e2da605ccae6865a99da491b97e";
const NEO_B$_CONTRACT_ADDRESS = "0x3782720ad22ecfdd26cc99135dbc6739a47a38c9";
const NEO_GLC_CONTRACT_ADDRESS = "0x77dc8cadcaef3694ab0f23901d8d9d825b19e6a2";
const NEO__7F_CONTRACT_ADDRESS = "0x8d91c0b210dcd568d287711a4c1c54c7ae392814";
const NEO_PEPE_CONTRACT_ADDRESSH = "0x8a651ecad98582603323bdd20169b81b81c1da5c";
const NEO_APE_CONTRACT_ADDRESS = "0x63f1a9c6bef178f54a6332b874407068d9a99e50";

export const NEO_MAINNET_TOKENS = [
  createTokenMetadata({
    hash: NEO_NEP_CONTRACT_ADDRESS[MAINNET],
    symbol: "NEP",
    icon: "/symbols/nep.png",
    decimals: 8,
    pairs: [
      NEO_BNEO_CONTRACT_ADDRESS[MAINNET],
      NEO_GAS_CONTRACT_ADDRESS,
      NEO_FWBTC_CONTRACT_ADDRESS,
      NEO_FWETH_CONTRACT_ADDRESS,
      NEO_USDT_CONTRACT_ADDRESS,
      NEO_TTM_CONTRACT_ADDRESS,
    ],
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: NEO_NEO_CONTRACT_ADDRESS,
    symbol: "NEO",
    icon: NEO_LOGO,
    decimals: 0,
    pairs: [],
    isWhitelisted: true,
    isNative: true,
    nativePair: {
      hash: NEO_BNEO_CONTRACT_ADDRESS[MAINNET],
      symbol: "bNEO",
      decimals: 8,
    },
  }),
  createTokenMetadata({
    hash: NEO_BNEO_CONTRACT_ADDRESS[MAINNET],
    symbol: "bNEO",
    icon: "/symbols/bneo.jpeg",
    decimals: 8,
    pairs: [
      NEO_GAS_CONTRACT_ADDRESS,
      NEO_USDT_CONTRACT_ADDRESS,
      NEO_NEP_CONTRACT_ADDRESS[MAINNET],
      NEO_TTM_CONTRACT_ADDRESS,
    ],
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: NEO_TTM_CONTRACT_ADDRESS,
    symbol: "TTM",
    icon: "/symbols/ttm.png",
    decimals: 8,
    pairs: [
      NEO_NEP_CONTRACT_ADDRESS[MAINNET],
      NEO_USDT_CONTRACT_ADDRESS,
      NEO_BNEO_CONTRACT_ADDRESS[MAINNET],
    ],
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: NEO_B$_CONTRACT_ADDRESS,
    symbol: "B$",
    icon: "/symbols/b$.png",
    decimals: 8,
    pairs: [],
  }),
  createTokenMetadata({
    hash: NEO_GAS_CONTRACT_ADDRESS,
    symbol: "GAS",
    icon: "/symbols/gas.svg",
    decimals: 8,
    pairs: [
      NEO_BNEO_CONTRACT_ADDRESS[MAINNET],
      NEO_NEP_CONTRACT_ADDRESS[MAINNET],
      NEO_USDT_CONTRACT_ADDRESS,
    ],
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: NEO_FWBTC_CONTRACT_ADDRESS,
    symbol: "fWBTC",
    icon: "/symbols/btc.png",
    decimals: 8,
    pairs: [NEO_NEP_CONTRACT_ADDRESS[MAINNET]],
  }),
  createTokenMetadata({
    hash: NEO_FWETH_CONTRACT_ADDRESS,
    symbol: "fWETH",
    icon: "/symbols/eth.png",
    decimals: 18,
    pairs: [NEO_NEP_CONTRACT_ADDRESS[MAINNET]],
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: NEO_USDT_CONTRACT_ADDRESS,
    symbol: "fUSDT",
    icon: "/symbols/usdt.png",
    decimals: 6,
    pairs: [
      NEO_NEP_CONTRACT_ADDRESS[MAINNET],
      NEO_TTM_CONTRACT_ADDRESS,
      NEO_BNEO_CONTRACT_ADDRESS[MAINNET],
    ],
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: NEO_TGAS_CONTRACT_ADDRESS,
    symbol: "TGAS",
    icon: "/symbols/TGAS.svg",
    decimals: 8,
    pairs: [],
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: NEO_WATT_CONTRACT_ADDRESS,
    symbol: "WATT",
    icon: "/symbols/WATT.svg",
    decimals: 8,
    pairs: [],
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: NEO_LITH_CONTRACT_ADDRESS,
    symbol: "LITH",
    icon: "/symbols/LITH.svg",
    decimals: 8,
    pairs: [],
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: NEO_HIST_CONTRACT_ADDRESS,
    symbol: "HIST",
    icon: "/symbols/HIST.svg",
    decimals: 8,
    pairs: [],
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: NEO_MAG_CONTRACT_ADDRESS,
    symbol: "MAG",
    icon: "/symbols/MAG.svg",
    decimals: 8,
    pairs: [],
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: NEO_HOOD_CONTRACT_ADDRESS,
    symbol: "Hood",
    icon: "/symbols/hood.png",
    decimals: 8,
    pairs: [],
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: NEO_NUDES_CONTRACT_ADDRESS,
    symbol: "TIPS",
    icon: "/symbols/tips.svg",
    decimals: 8,
    pairs: [],
  }),
  createTokenMetadata({
    hash: NEO_TED_CONTRACT_ADDRESS,
    symbol: "TEDS",
    icon: "/symbols/ted.png",
    decimals: 8,
    pairs: [],
  }),
  createTokenMetadata({
    hash: NEO_MAXI_CONTRACT_ADDRESS,
    symbol: "MAXI",
    icon: "/symbols/maxi.png",
    decimals: 8,
    pairs: [],
  }),
  createTokenMetadata({
    hash: NEO_FRANK_CONTRACT_ADDRESS,
    symbol: "frank",
    icon: "/symbols/frank.png",
    decimals: 8,
    pairs: [],
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: NEO_N3F_CONTRACT_ADDRESS,
    symbol: "N3F",
    icon: "/symbols/n3f.jpg",
    decimals: 8,
    pairs: [],
  }),
  createTokenMetadata({
    hash: NEO_GLC_CONTRACT_ADDRESS,
    symbol: "GLC",
    icon: "/symbols/glc.png",
    decimals: 8,
    pairs: [],
  }),
  createTokenMetadata({
    hash: NEO__7F_CONTRACT_ADDRESS,
    symbol: "7f",
    icon: "/symbols/7f.png",
    decimals: 8,
    pairs: [],
  }),
  createTokenMetadata({
    hash: NEO_PEPE_CONTRACT_ADDRESSH,
    symbol: "PEPE",
    icon: "/symbols/pepe.png",
    decimals: 18,
    pairs: [],
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: NEO_APE_CONTRACT_ADDRESS,
    symbol: "APE",
    icon: "/symbols/ape.png",
    decimals: 8,
    pairs: [],
    isWhitelisted: true,
  }),
];

export const NEO_TESTNET_TOKENS = [
  createTokenMetadata({
    hash: NEO_NEO_CONTRACT_ADDRESS,
    symbol: "NEO",
    icon: NEO_LOGO,
    decimals: 0,
    pairs: [],
    isWhitelisted: true,
    isNative: true,
    nativePair: {
      hash: NEO_BNEO_CONTRACT_ADDRESS[TESTNET],
      symbol: "bNEO",
      decimals: 8,
    },
  }),
  createTokenMetadata({
    hash: NEO_BNEO_CONTRACT_ADDRESS[TESTNET],
    symbol: "bNEO",
    icon: "/symbols/bneo.jpeg",
    decimals: 8,
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: NEO_GAS_CONTRACT_ADDRESS,
    symbol: "GAS",
    icon: "/symbols/gas.svg",
    decimals: 8,
    isWhitelisted: true,
  }),
  createTokenMetadata({
    hash: NEO_NEP_CONTRACT_ADDRESS[TESTNET],
    symbol: "NEP",
    icon: "/symbols/nep.png",
    decimals: 8,
    isWhitelisted: true,
  }),
];

export const NEO_TOKENS = {
  [NEO_CHAIN]: {
    [MAINNET]: NEO_MAINNET_TOKENS,
    [TESTNET]: NEO_TESTNET_TOKENS,
  },
};
