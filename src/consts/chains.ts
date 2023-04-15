export const NEO_CHAIN = "NEO_CHAIN";
export const POLYGON_CHAIN = "POLYGON_CHAIN";

export type CHAINS = typeof NEO_CHAIN | typeof POLYGON_CHAIN;

export const LIST = [NEO_CHAIN, POLYGON_CHAIN];

export const CONFIGS = {
  [NEO_CHAIN]: {
    label: "Neo",
    color: "primary",
    icon: "/symbols/neo.svg"
  },  
  [POLYGON_CHAIN]: {
    label: "Polygon",
    color: "info",
    icon: "/symbols/matic.png"
  }
};
