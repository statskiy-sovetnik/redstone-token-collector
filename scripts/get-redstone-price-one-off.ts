import { Network } from '../types';
import { RedstoneDeployedAddresses, RPC } from './config';
import hre, { ethers } from "hardhat";
import abi from "../abi.json";
import { getRedstonePrice } from './utils/get-redstone-price';

const symbol = "LDO";

async function main() {
  const chainId: Network = hre.network.config.chainId!;
  const provider = new ethers.providers.JsonRpcProvider(RPC[chainId]);
  
  // Get Redstone price provider contract
  const deployed_address = RedstoneDeployedAddresses[chainId];
  //const RedstoneProvider = await ethers.getContractAt("RedstoneProviderMock", deployed_address);
  const RedstoneProvider = new ethers.Contract(deployed_address, abi.abi, provider);

  const price = await getRedstonePrice(RedstoneProvider, symbol);
  console.log("Price: ", price.toString());
}

main()
.then()
.catch(err => {
  console.log(err);
})