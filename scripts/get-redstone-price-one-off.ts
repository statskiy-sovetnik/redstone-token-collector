import { Network } from '../types';
import { RedstoneDeployedAddresses, RPC } from './config';
import hre, { ethers } from "hardhat";
import { getRedstonePrice } from './utils/get-redstone-price';
import { getProviderAbi } from './utils/get-provider-abi';

const symbol = "JOE";

async function main() {
  const chainId: Network = hre.network.config.chainId!;
  const provider = new ethers.providers.JsonRpcProvider(RPC[chainId]);
  
  // Get Redstone price provider contract
  const deployed_address = RedstoneDeployedAddresses[chainId];
  const abi = getProviderAbi(chainId);
  const RedstoneProvider = new ethers.Contract(deployed_address, abi, provider);

  const price = await getRedstonePrice(chainId,RedstoneProvider, symbol);
  console.log("Price: ", price.toString());
}

main()
.then()
.catch(err => {
  console.log(err);
})