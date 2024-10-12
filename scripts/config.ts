import { Network } from '../types';

export const RedstoneDeployedAddresses = {
  [Network.Arbitrum]: "0x52a2C543585C99Da08786E69476609b5154b2fA2",
  [Network.Polygon]: "0xbD9fa0fFA7E824CbF9EA36c462aA2b5cCEEC6838",
  [Network.Bsc]: "0xE77CA2f7f238A8412d8a3F18996FF7431215503A"
}

export const RPC = {
  [Network.Arbitrum]: "https://arb1.arbitrum.io/rpc",
  [Network.Bsc]: "https://bsc-dataseed.binance.org",
  [Network.Polygon]: "https://polygon.llamarpc.com",
}

export const GarbageQuotes = [
  "/",
  "_FUNDAMENTAL",
  "-TWAP",
  "__FRAXTAL__",
  "_RATE_PROVIDER",
  "USDC.DAI",
  "USDC.USDT",
  "ETH_CLE",
  "ETH_ELE",
  "YY_",
  "___ALL_FEEDS___",
  "PENDLE_",
  "GM_",
]