import { Network } from '../types';

export const RedstoneDeployedAddresses = {
  [Network.Arbitrum]: "0xb8f38fD413DfEa21cCb0b37A448B0f7b8F98898A",
  [Network.Polygon]: "0x3f5bEcaa66413EaF06153Fd51983893006D201E6",
  [Network.Bsc]: "0x7f6334913C19395Da38eF4431C1454bF6148D21C"
}

export const RPC = {
  [Network.Arbitrum]: "https://arb1.arbitrum.io/rpc",
  [Network.Bsc]: "https://bsc-dataseed.binance.org",
  [Network.Polygon]: "https://polygon-pokt.nodies.app",
}