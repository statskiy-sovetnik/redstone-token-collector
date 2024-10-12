import axios from 'axios';
const REDSTONE_PATH = "redstone-primary-prod-tokens.json";
const ASPIS_PATH = "aspis-supported-funds-list.json";
const RESULT_PATH = "redstone-unique-tokens.json";
const ONE_INCH_PATH = "one-inch-token.json";
const ODOS_PATH = "odos-tokens.json";
import { promises as fs } from "fs";
import { AspisFund, Network, OdosTokenMap, RedstoneTokenCollection, RedstoneTokenConfig, Token } from '../types';
import hre from "hardhat";
import { isAspisFundInTheList } from './utils/is-aspis-fund-in-the-list';
import { formatOdosTokens } from './utils/format-odos-tokens';
import { isTokenInTheList } from './utils/is-token-in-the-list';


/* 
  1. Gets tokens supported by Aspis
  2. Get tokens supported by Redstone
  3. Goes through redstone tokens and finds tokens that are not supported by Aspis
  4. The unique tokens also have to be supported on this chain by
    either 1inch or odos
 */

async function main() {
  const chainId: Network = hre.network.config.chainId!;
  const aspis_supported_funds_file = JSON.parse(await fs.readFile(ASPIS_PATH, { encoding: "utf8" }));
  const redstone_tokens = JSON.parse(await fs.readFile(REDSTONE_PATH, { encoding: "utf8" }));
  const one_inch_file = JSON.parse(await fs.readFile(ONE_INCH_PATH, { encoding: "utf8" }));
  const odos_file = JSON.parse(await fs.readFile(ODOS_PATH, { encoding: "utf8" }));

  const one_inch_tokens: Token[] = one_inch_file[chainId];
  const odos_tokens_map: OdosTokenMap = odos_file[chainId].tokenMap;
  const odos_tokens: Token[] = formatOdosTokens(chainId, odos_tokens_map);

  const redstone_unique_tokens_file = JSON.parse(await fs.readFile(RESULT_PATH, { encoding: "utf8" }));

  if (!one_inch_tokens) {
    throw new Error("No one inch tokens in the config file");
  }
  if (!odos_tokens) {
    throw new Error("No odos tokens in the config file");
  }

  const aspis_supported_funds = aspis_supported_funds_file[chainId].tokens;

  if (!aspis_supported_funds) {
    throw new Error("No aspis funds in the config file");
  }

  const unique_redstone_tokens = getUniqueRedstoneTokens(
    redstone_tokens, 
    aspis_supported_funds,
    one_inch_tokens,
    odos_tokens
  );

  const count = unique_redstone_tokens ? Object.keys(unique_redstone_tokens).length : 0;
  console.log(`Number of unique tokens: ${count}`);

  redstone_unique_tokens_file[chainId] = unique_redstone_tokens;
  await fs.writeFile(RESULT_PATH, JSON.stringify(redstone_unique_tokens_file, null, 2));
}

function getUniqueRedstoneTokens(
  redstone_tokens: RedstoneTokenCollection,
  aspis_supported_funds: AspisFund[],
  one_inch_tokens: Token[],
  odos_tokens: Token[]
): RedstoneTokenCollection {
  const unique_redstone_tokens: RedstoneTokenCollection = redstone_tokens;

  for (let token_id in redstone_tokens) {
    // Either it's already supported by Aspid or it doesn't belong to this chain
    // We verify the tokens against Odos and 1inch to check the chain
    if (
      isAspisFundInTheList(aspis_supported_funds, token_id) ||
      !isTokenSupportedByOdosOr1inch(one_inch_tokens, odos_tokens, token_id)
    ) {
      delete unique_redstone_tokens[token_id];    
    }
  }

  return unique_redstone_tokens;
}

function isTokenSupportedByOdosOr1inch(
  one_inch_tokens: Token[],
  odos_tokens: Token[],
  token_id: string
) {
  return isTokenInTheList(one_inch_tokens, token_id) || 
    isTokenInTheList(odos_tokens, token_id);
}

main()
.then()
.catch(err => {
  console.log(err);
})