import { Network } from '../types';

export const RedstoneDeployedAddresses = {
  [Network.Arbitrum]: "0xb8f38fD413DfEa21cCb0b37A448B0f7b8F98898A",
  [Network.Polygon]: "",
  [Network.Bsc]: ""
}

export const RPC = {
  [Network.Arbitrum]: "https://arb1.arbitrum.io/rpc",
  [Network.Bsc]: "https://bsc-dataseed.binance.org",
  [Network.Polygon]: "https://polygon-pokt.nodies.app",
}