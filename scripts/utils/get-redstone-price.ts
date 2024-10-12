import { DataServiceWrapper, WrapperBuilder } from '@redstone-finance/evm-connector';
import { RedstoneProviderMock } from '../../typechain-types';
import { Contract } from 'ethers';
import {
  convertStringToBytes32,
} from "@redstone-finance/protocol/dist/src/common/utils";
import { Network } from '../../types';


export async function getRedstonePrice(
  chainId: Network,
  RedstoneProvider: Contract, 
  symbol: string
): Promise<bigint> {

  let price = 0n;
  const feedId = convertStringToBytes32(symbol);

  const dataServiceId = chainId === Network.Arbitrum ?
    "redstone-arbitrum-prod" :
    "redstone-primary-prod";
  const redstonePayload = await (new DataServiceWrapper({
    dataServiceId: dataServiceId,
    dataPackagesIds: [symbol]
  }).getRedstonePayloadForManualUsage(RedstoneProvider));
  
  // Interact with the contract (getting oracle value securely)
  price = await RedstoneProvider.parsePriceWithManualPayload(
    feedId,
    redstonePayload
  );

  return price;
}