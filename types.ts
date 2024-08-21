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