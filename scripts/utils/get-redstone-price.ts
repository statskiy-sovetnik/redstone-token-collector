import { DataServiceWrapper, WrapperBuilder } from '@redstone-finance/evm-connector';
import { RedstoneProviderMock } from '../../typechain-types';
import { Contract } from 'ethers';
import {
  convertStringToBytes32,
} from "@redstone-finance/protocol/dist/src/common/utils";
import { Network } from '../../types';


export async function getRedstonePrice(
  RedstoneProvider: Contract, 
  symbol: string
): Promise<bigint> {

  let price = 0n;
  const feedId = convertStringToBytes32(symbol);

  const redstonePayload = await (new DataServiceWrapper({
    dataServiceId: "redstone-main-demo",
    dataPackagesIds: [symbol]
  }).getRedstonePayloadForManualUsage(RedstoneProvider));
  
  // Interact with the contract (getting oracle value securely)
  price = await RedstoneProvider.parsePriceWithManualPayload(
    feedId,
    redstonePayload
  );

  return price;
}