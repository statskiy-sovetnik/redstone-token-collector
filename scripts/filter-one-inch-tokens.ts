import { promises as fs } from "fs";
const PATH = "one-inch-token.json";
const RESULT_PATH = "compatible-tokens.json";
const UNSUPPORTED_TOKENS_PATH = "unsupported-tokens.json";
import hre from "hardhat";
import { ethers } from "ethers";
import { RedstoneDeployedAddresses, RPC } from './config';
import { Network } from '../types';
import { filterTokenListWithRedstone } from './utils/filter-token-list-with-redstone';
import { getProviderAbi } from './utils/get-provider-abi';


/* 
  Gets tokens that are supported by OneInch from the file,
  checks them against redstone Oracle support and
  sends them to a new file
 */

async function main() {
  const one_inch_tokens_file = JSON.parse(await fs.readFile(PATH, { encoding: "utf8" }));
  const compatible_tokens_file = JSON.parse(await fs.readFile(RESULT_PATH, { encoding: "utf8" }));
  const unsupported_tokens_file = JSON.parse(await fs.readFile(UNSUPPORTED_TOKENS_PATH, { encoding: "utf8" }));
  const chainId: Network = hre.network.config.chainId!;
  const provider = new ethers.providers.JsonRpcProvider(RPC[chainId]);

  const tokens = one_inch_tokens_file[chainId];

  if (!tokens) {
    throw new Error("No 1inch tokens in the config file");
  }

  /* 
    Initialize arrays
   */
  if (!compatible_tokens_file[chainId]) {
    compatible_tokens_file[chainId] = [];
  }
  let compatible_tokens = compatible_tokens_file[chainId];
  if (!unsupported_tokens_file[chainId]) {
    unsupported_tokens_file[chainId] = [];
  }
  let unsupported_tokens = unsupported_tokens_file[chainId];

  // Get Redstone price provider contract
  const deployed_address = RedstoneDeployedAddresses[chainId];
  const abi = getProviderAbi(chainId);
  const RedstoneProvider = new ethers.Contract(deployed_address, abi, provider);

  const res = await filterTokenListWithRedstone(
    chainId,
    tokens, 
    compatible_tokens,
    unsupported_tokens,
    RedstoneProvider
  );

  compatible_tokens = res.compatible_tokens;
  unsupported_tokens = res.unsupported_tokens;

  // Update the files
  compatible_tokens_file[chainId] = compatible_tokens;
  unsupported_tokens_file[chainId] = unsupported_tokens;
  await fs.writeFile(RESULT_PATH, JSON.stringify(compatible_tokens_file, null, 2));
  await fs.writeFile(UNSUPPORTED_TOKENS_PATH, JSON.stringify(unsupported_tokens_file, null, 2));    
}

main()
  .then()
  .catch(error => {
    console.log(error);
  })