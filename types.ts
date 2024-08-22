export type Token = {
  address: string,
  name: string,
  decimals: number,
  symbol: string,
  chainId: number,
}

export enum Network {
  Arbitrum = 42161,
  Bsc = 56,
  Polygon = 137
}

export type OdosToken = {
  name: string;
  symbol: string;
  decimals: number;
  assetId: string;
  assetType: string;
  protocolId: string;
  isRebasing: boolean;
};

export type OdosTokenMap = {
  [address: string]: OdosToken;
};