import hre, { ethers } from "hardhat";
import { RPC } from './config';
import { Network } from '../types';
import abi from "../abi.json";
import contractData from "../artifacts/contracts/RedstoneProviderMock.sol/RedstoneProviderMock.json";
import 'dotenv/config';

async function main() {
  const chainId: Network = hre.network.config.chainId!;
  const rpc = RPC[chainId];
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  //const deployer = provider.getSigner();
  const wal = new ethers.Wallet(process.env.DEPLOYER_PK!, provider );

  /* const factory = new ethers.ContractFactory( abi.abi , contractData.bytecode, wal);
  const ctr = await factory.deploy();
  await ctr.deployed(); */
  const ContractFactory = await ethers.getContractFactory("RedstoneProviderMock", wal);
  const ctr = await ContractFactory.deploy();
  //await ctr.deployed();

  console.log("Deployed at address: ", ctr.address);
}

main()
.then()
.catch(error => {
  console.log(error);
})