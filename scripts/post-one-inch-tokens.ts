import { getOneInchTokens } from './get-one-inch-tokens';
import { promises as fs } from "fs";
import { Token } from '../types';
const PATH = "one-inch-token.json";

async function main() {
  const tokens = await getOneInchTokens();

  if (!tokens) {
    throw new Error("Failed to fetch tokens from One Inch");
  }

  const tokens_file = JSON.parse(await fs.readFile(PATH, { encoding: "utf8" }));
  let count = 0;

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const chainId = t.chainId;

    if (!tokens_file[chainId]) {
      tokens_file[chainId] = [];
    }

    const has_duplicate = tokens_file[chainId].find((_t: Token) => {
      return _t.symbol === t.symbol;
    }) !== undefined;

    if (!has_duplicate) {
      tokens_file[chainId].push({
        address: t.address,
        name: t.name,
        decimals: t.decimals,
        symbol: t.symbol,
      });
      count++;
    }
  }

  await fs.writeFile(PATH, JSON.stringify(tokens_file, null, 2));

  console.log(`Saved ${count} tokens to json file`);
}

main()
  .then()
  .catch(error => {
    console.error(error);
  });