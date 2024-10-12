const REDSTONE_PATH = "redstone-primary-prod-tokens.json";
const ASPIS_PATH = "aspis-supported-funds-list.json";
const RESULT_PATH = "redstone-unsupported-tokens.json";
import { promises as fs } from "fs";
import { AspisFund, Network, OdosTokenMap, RedstoneTokenCollection} from '../types';
import hre from "hardhat";


/* 
  1. Gets tokens supported by Aspis
  2. Get tokens supported by Redstone
  3. Goes through Aspis funds and keeps only those that are NOT supported by Redstone
 */

async function main() {
  const chainId: Network = hre.network.config.chainId!;
  const aspis_supported_funds_file = JSON.parse(await fs.readFile(ASPIS_PATH, { encoding: "utf8" }));
  const redstone_tokens = JSON.parse(await fs.readFile(REDSTONE_PATH, { encoding: "utf8" }));

  const redston_unsupported_tokens_file = JSON.parse(await fs.readFile(RESULT_PATH, { encoding: "utf8" }));

  const aspis_supported_funds = aspis_supported_funds_file[chainId].tokens;

  if (!aspis_supported_funds) {
    throw new Error("No aspis funds in the config file");
  }

  const unique_aspis_tokens = getUniqueAspisTokens(
    aspis_supported_funds,
    redstone_tokens
  );

  const count = unique_aspis_tokens ? Object.keys(unique_aspis_tokens).length : 0;
  console.log(`Number of unique tokens: ${count}`);

  redston_unsupported_tokens_file[chainId] = unique_aspis_tokens;
  await fs.writeFile(RESULT_PATH, JSON.stringify(redston_unsupported_tokens_file, null, 2));
}

function getUniqueAspisTokens(
  aspis_supported_funds: AspisFund[],
  redstone_tokens: RedstoneTokenCollection
): AspisFund[] {
  const unique_aspis_tokens: AspisFund[] = [];

  for (let i = 0; i < aspis_supported_funds.length; i++) {
    const aspis_fund: AspisFund = aspis_supported_funds[i];

    if (!redstone_tokens[aspis_fund.baseToken]) {
      unique_aspis_tokens.push(aspis_fund)
    }
  }

  return unique_aspis_tokens
}

main()
.then()
.catch(err => {
  console.log(err);
})