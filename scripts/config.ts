import { Network } from '../types';

export const RedstoneDeployedAddresses = {
  [Network.Arbitrum]: "0x4986f36cDA360A8826850F546E4dDf71977cD463",
  [Network.Polygon]: "0xE77CA2f7f238A8412d8a3F18996FF7431215503A",
  [Network.Bsc]: "0x3f5bEcaa66413EaF06153Fd51983893006D201E6"
}

export const RPC = {
  [Network.Arbitrum]: "https://arb1.arbitrum.io/rpc",
  [Network.Bsc]: "https://bsc-dataseed.binance.org",
  [Network.Polygon]: "https://polygon.llamarpc.com",
}