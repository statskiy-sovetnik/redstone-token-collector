import { promises as fs } from "fs";
const PATH = "one-inch-token.json";
const RESULT_PATH = "compatible-tokens.json";
const UNSUPPORTED_TOKENS_PATH = "unsupported-tokens.json";
import hre from "hardhat";
import { ethers, Signer } from "ethers";
import { RedstoneDeployedAddresses, RPC } from './config';
import { Network, Token } from '../types';
import { WrapperBuilder } from "@redstone-finance/evm-connector";
import {
  convertStringToBytes32,
} from "@redstone-finance/protocol/dist/src/common/utils";
import abi from "../abi.json";


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
  const compatible_tokens = compatible_tokens_file[chainId];
  if (!unsupported_tokens_file[chainId]) {
    unsupported_tokens_file[chainId] = [];
  }
  const unsupported_tokens = unsupported_tokens_file[chainId];

  // Get Redstone price provider contract
  const deployed_address = RedstoneDeployedAddresses[chainId];
  //const RedstoneProvider = await ethers.getContractAt("RedstoneProviderMock", deployed_address);
  const RedstoneProvider = new ethers.Contract(deployed_address, abi.abi, provider);

  for (let i = 0; i < tokens.length; i++) {
    const token: Token = tokens[i];
    const symbol = token.symbol;

    // Skip the check if the token is already known to be compatible
    const is_compatible = compatible_tokens.find((_t: Token) => {
      return _t.symbol === symbol;
    }) !== undefined;
    if (is_compatible) {
      console.log(`${symbol} is already configured to be compatible`);
      continue;
    }
    // Same if it is unsupported
    const is_unsupported = unsupported_tokens.find((_t: Token) => {
      return _t.symbol === symbol;
    }) !== undefined;
    if (is_unsupported) {
      console.log(`${symbol} is already configured to be unsupported`);
      continue;
    }
    console.log(`Checking the ${symbol} token...`);

    let price = 0n;
    try {
      const wrappedContract = WrapperBuilder.wrap(RedstoneProvider).usingDataService(
        {
          dataPackagesIds: [symbol],
        },
      );

      const feedId = convertStringToBytes32(symbol);
      price = await wrappedContract.parsePrice(feedId);
    }
    catch(err) {
      console.log(err);
      unsupported_tokens.push(token);
      console.log(`Failed to fetch price for ${symbol}. Marking it unsupported`);
      continue;
    }

    if (price > 0n) {
      compatible_tokens.push(token);
      console.log(`${symbol} is supported. Updated the configuration`);
    }
    else {
      unsupported_tokens.push(token);
      console.log(`${symbol} is NOT supported by Redstone.`)
    }
  }

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