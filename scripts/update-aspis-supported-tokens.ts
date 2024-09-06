// TODO create types for token configs
// TODO get chain id
// TODO iterate through compatible-tokens of this chain id
  // TODO check if token exists in aspis-supported-tokens
  // TODO write to array if doesn't
  // TODO log that the token was added
// TODO update the aspis-supported-tokens config file
import { promises as fs } from "fs";
import hre from "hardhat";
import { AspisToken, Network, Token } from '../types';

const ASPIS_TOKENS_PATH = "aspis-supported-tokens.json";
const COMPATIBLE_TOKENS_PATH = "compatible-tokens.json";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

/* 
  Extends the supported Aspis tokens with "compatible tokens" (supported by redstone)
 */

async function main() {
  const aspis_tokens_file = JSON.parse(await fs.readFile(ASPIS_TOKENS_PATH, { encoding: "utf8" }));
  const compatible_tokens_file = JSON.parse(await fs.readFile(COMPATIBLE_TOKENS_PATH, { encoding: "utf8" }));
  const chainId: Network = hre.network.config.chainId!;
  let compatible_tokens: Token[] = compatible_tokens_file[chainId];
  let aspis_supported_tokens: AspisToken[] = aspis_tokens_file[chainId].tokens;

  for (let i = 0; i < compatible_tokens.length; i++) {
    const token: Token = compatible_tokens[i];

    if (isTokenInTheList(aspis_supported_tokens, token.symbol)) {
      continue;
    }
    else {
      aspis_supported_tokens.push(convertToAspisToken(token));
      console.log(`Added ${token.symbol} to aspis supported tokens`);
    }
  }

  aspis_tokens_file[chainId].tokens = aspis_supported_tokens;
  await fs.writeFile(ASPIS_TOKENS_PATH, JSON.stringify(aspis_tokens_file, null, 2));
}

function convertToAspisToken(t: Token): AspisToken {
  return {
    baseToken: t.symbol,
    redstoneFeedId: t.symbol,
    tokenAddress: t.address,
    priceFeed: ZERO_ADDRESS,
    decimals: t.decimals
  }
}

function isTokenInTheList(list: Array<AspisToken>, symbol: string): boolean {
  const res = list.find((_t: AspisToken) => {
    return _t.baseToken === symbol;
  });

  return res !== undefined;
}

main()
.then()
.catch(err => {
  console.log(err);
})