import { ethers } from "hardhat";

async function main() {
  const ContractFactory = await ethers.getContractFactory("RedstoneProviderMock");
  const ctr = await ContractFactory.deploy();
  await ctr.deployed();

  console.log("Deployed at address: ", ctr.address);
}

main()
.then()
.catch(error => {
  console.log(error);
})