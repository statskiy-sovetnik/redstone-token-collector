import { DataServiceWrapper, WrapperBuilder } from '@redstone-finance/evm-connector';
import { RedstoneProviderMock } from '../../typechain-types';
import { Contract } from 'ethers';
import {
  convertStringToBytes32,
} from "@redstone-finance/protocol/dist/src/common/utils";
import { Network } from '../../types';
import { RedstoneDeployedAddresses, RPC } from '../config';
import hre from "hardhat";
import { ethers } from "ethers";
import abi from "../../abi.json";

const symbols = ['ETH', 'USDC', 'LINK', 'USDT', 'ETH', 'wstETH', 'wstETH', 'ezETH', 'MKR'];

async function main(): Promise<string> {
  const chainId: Network = hre.network.config.chainId!;
  const deployed_address = RedstoneDeployedAddresses[chainId];
  const rpc = RPC[chainId];
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const RedstoneProvider = new ethers.Contract(deployed_address, abi.abi, provider);

  let price = 0n;
  let redstonePayload;
  //const feedId = convertStringToBytes32(symbol);

  console.log(RedstoneProvider);
  console.log(symbols);
  try {
    redstonePayload = await (new DataServiceWrapper({
      dataServiceId: "redstone-main-demo",
      dataPackagesIds: symbols
    }).getRedstonePayloadForManualUsage(RedstoneProvider));
  }
  catch(err) {
    console.log(err);
  }
  
  
  // Interact with the contract (getting oracle value securely)
  /* price = await RedstoneProvider.parsePriceWithManualPayload(
    feedId,
    redstonePayload
  ); */
  if (redstonePayload === "") {
    console.log("Huy tam plaval");
  }
  //console.log(redstonePayload);

  return redstonePayload || "";
}

main()
.then()
.catch(err => {
  console.log(err);
});