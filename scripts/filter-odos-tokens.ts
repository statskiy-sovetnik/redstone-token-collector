import { promises as fs } from "fs";
const PATH = "odos-tokens.json";
const RESULT_PATH = "compatible-tokens.json";
const UNSUPPORTED_TOKENS_PATH = "unsupported-tokens.json";
import hre from "hardhat";
import { ethers } from "ethers";
import { RedstoneDeployedAddresses, RPC } from './config';
import { Network, OdosTokenMap, Token } from '../types';
import abi from "../abi.json";
import { filterTokenListWithRedstone } from './utils/filter-token-list-with-redstone';
import { formatOdosTokens } from './utils/format-odos-tokens';


/* 
  Gets tokens that are supported by OneInch from the file,
  checks them against redstone Oracle support and
  sends them to a new file
 */

async function main() {
  const odos_tokens_file = JSON.parse(await fs.readFile(PATH, { encoding: "utf8" }));
  const compatible_tokens_file = JSON.parse(await fs.readFile(RESULT_PATH, { encoding: "utf8" }));
  const unsupported_tokens_file = JSON.parse(await fs.readFile(UNSUPPORTED_TOKENS_PATH, { encoding: "utf8" }));
  const chainId: Network = hre.network.config.chainId!;
  const provider = new ethers.providers.JsonRpcProvider(RPC[chainId]);

  const odos_tokens: OdosTokenMap = odos_tokens_file[chainId].tokenMap;

  if (!odos_tokens) {
    throw new Error("No Odos tokens in the config file");
  }
  
  const tokens = formatOdosTokens(chainId, odos_tokens);

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
  //const RedstoneProvider = await ethers.getContractAt("RedstoneProviderMock", deployed_address);
  const RedstoneProvider = new ethers.Contract(deployed_address, abi.abi, provider);

  const res = await filterTokenListWithRedstone(
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