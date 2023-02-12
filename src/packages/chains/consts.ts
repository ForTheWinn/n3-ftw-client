export const NEO_CHAIN = "NEO_CHAIN";
export const POLYGON_CHAIN = "POLYGON_CHAIN";

export type CHAINS = typeof NEO_CHAIN | typeof POLYGON_CHAIN;

export const chainList = [
    NEO_CHAIN,
    POLYGON_CHAIN
]

export const chainThemes = {
  [NEO_CHAIN]: {
    label: "Neo",
    color: "primary",
    icon: "/symbols/neo.svg",
  },
  [POLYGON_CHAIN]: {
    label: "Polygon",
    color: "danger",
    icon: "/symbols/matic.png",
  },
};