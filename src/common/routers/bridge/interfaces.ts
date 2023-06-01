export interface IBridgeMintPagenate {
  totalItems: number;
  totalPages: number;
  items: IBridgeMint[];
}

export interface IBridgeBurnPagenate {
  totalItems: number;
  totalPages: number;
  items: IBridgeBurn[];
}

export interface IBridgeMint{
  no: string;
  neoTokenAddress: string;
  evmTokenAddress: string;
  sender: string;
  evmReceiver: string;
  amount: string;
  createdAt: string;
}

export interface IBridgeBurn {
  no: string;
  neoTokenAddress: string;
  evmTokenAddress: string;
  evmSender: string;
  receiver: string;
  amount: string;
  createdAt: string;
}

export interface IBridgeChain {
  type: string;
  icon: string;
  name: string;
  chainId: number;
  chains: number[];
  rpc: string;
}
