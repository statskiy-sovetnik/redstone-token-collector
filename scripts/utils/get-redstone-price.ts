import { WrapperBuilder } from '@redstone-finance/evm-connector';
import { RedstoneProviderMock } from '../../typechain-types';
import { Contract } from 'ethers';
import {
  convertStringToBytes32,
} from "@redstone-finance/protocol/dist/src/common/utils";


export async function getRedstonePrice(
  RedstoneProvider: Contract, 
  symbol: string
): Promise<bigint> {
  const wrappedContract = WrapperBuilder.wrap(RedstoneProvider).usingDataService(
    {
      dataPackagesIds: [symbol],
    },
  );

  const feedId = convertStringToBytes32(symbol);
  return await wrappedContract.parsePrice(feedId);
}