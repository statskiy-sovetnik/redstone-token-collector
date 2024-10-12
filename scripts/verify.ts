import hre from "hardhat";

const CONTRACT_ADDRESS = "0xbD9fa0fFA7E824CbF9EA36c462aA2b5cCEEC6838";

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