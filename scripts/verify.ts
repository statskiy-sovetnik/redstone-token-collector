import hre from "hardhat";

const CONTRACT_ADDRESS = "0xE77CA2f7f238A8412d8a3F18996FF7431215503A";

const main = async () => {
  /* 
    VERIFICATION
   */
  console.log("Verifying the contract...");
  await hre.run("verify:verify", {
    address: CONTRACT_ADDRESS,
    constructorArguments: [],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });