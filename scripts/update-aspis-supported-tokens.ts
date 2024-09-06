
import { promises as fs } from "fs";
import hre from "hardhat";
import { AspisFund, AspisToken, Network, Token } from '../types';
import { isTokenInTheList } from './utils/is-token-in-the-list';

const ASPIS_SUPPORTED_FUNDS_LIST_PATH = "aspis-supported-funds-list.json";
const ASPIS_SUPPORTED_TOKENS_LIST_PATH = "aspis-supported-tokens-list.json";
const COMPATIBLE_TOKENS_PATH = "compatible-tokens.json";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

/* 
  Extends the "aspis-supported-funds-list and aspis-supported-tokens-list"
   with "compatible tokens" (supported by redstone)
 */

async function main() {
  const aspis_funds_file = JSON.parse(await fs.readFile(ASPIS_SUPPORTED_FUNDS_LIST_PATH, { encoding: "utf8" }));
  const aspis_tokens_file = JSON.parse(await fs.readFile(ASPIS_SUPPORTED_TOKENS_LIST_PATH, { encoding: "utf8" }));
  const compatible_tokens_file = JSON.parse(await fs.readFile(COMPATIBLE_TOKENS_PATH, { encoding: "utf8" }));

  const chainId: Network = hre.network.config.chainId!;
  let compatible_tokens: Token[] = compatible_tokens_file[chainId];
  let aspis_supported_funds: AspisFund[] = aspis_funds_file[chainId].tokens;
  let aspis_supported_tokens: AspisToken[] = aspis_tokens_file[chainId];

  for (let i = 0; i < compatible_tokens.length; i++) {
    const token: Token = compatible_tokens[i];

    // Updating funds list
    if (!isAspisFundInTheList(aspis_supported_funds, token.symbol)) {
      aspis_supported_funds.push(convertToAspisFund(token));
      console.log(`Funds: added ${token.symbol}`);
    }
    
    // Updating tokens list
    if (!isAspisTokenInTheList(aspis_supported_tokens, token.symbol)) {
      aspis_supported_tokens.push(convertToAspisToken(token));
      console.log(`Tokens: added ${token.symbol}`);
    }
  }

  aspis_funds_file[chainId].tokens = aspis_supported_funds;
  aspis_tokens_file[chainId] = aspis_supported_tokens;
  await fs.writeFile(ASPIS_SUPPORTED_FUNDS_LIST_PATH, JSON.stringify(aspis_funds_file, null, 2));
  await fs.writeFile(ASPIS_SUPPORTED_TOKENS_LIST_PATH, JSON.stringify(aspis_tokens_file, null, 2));
}

function convertToAspisFund(t: Token): AspisFund {
  return {
    baseToken: t.symbol,
    redstoneFeedId: t.symbol,
    tokenAddress: t.address,
    priceFeed: ZERO_ADDRESS,
    decimals: t.decimals
  }
}

function convertToAspisToken(t: Token): AspisToken {
  return {
    symbol: t.symbol,
    address: t.address,
    decimals: t.decimals,
    icon: undefined
  }
}

function isAspisFundInTheList(list: Array<AspisFund>, symbol: string): boolean {
  const res = list.find((_t: AspisFund) => {
    return _t.baseToken === symbol;
  });

  return res !== undefined;
}

function isAspisTokenInTheList(list: Array<AspisToken>, symbol: string): boolean {
  const res = list.find((_t: AspisToken) => {
    return _t.symbol === symbol;
  });

  return res !== undefined;
}

main()
.then()
.catch(err => {
  console.log(err);
})