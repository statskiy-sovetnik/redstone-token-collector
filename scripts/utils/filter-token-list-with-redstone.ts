import { Contract } from 'ethers';
import { RedstoneProviderMock } from '../../typechain-types';
import { Token } from '../../types';
import { getRedstonePrice } from './get-redstone-price';
import { isTokenInTheList } from './is-token-in-the-list';

type FilteredTokenArrays = {
  compatible_tokens: Array<Token>,
  unsupported_tokens: Array<Token>
}

export async function filterTokenListWithRedstone(
  tokens: Array<Token>,
  compatible_tokens: Array<Token>,
  unsupported_tokens: Array<Token>,
  RedstoneProvider: Contract
): Promise<FilteredTokenArrays> {
  for (let i = 0; i < tokens.length; i++) {
    const token: Token = tokens[i];
    const symbol = token.symbol;

    // Skip the check if the token is already known to be compatible
    const is_compatible = isTokenInTheList(compatible_tokens, symbol);
    if (is_compatible) {
      console.log(`${symbol} is already configured to be compatible`);
      continue;
    }
    // Same if it is unsupported
    const is_unsupported = isTokenInTheList(unsupported_tokens, symbol);
    if (is_unsupported) {
      console.log(`${symbol} is already configured to be unsupported`);
      continue;
    }
    console.log(`Checking the ${symbol} token...`);

    let price = 0n;
    try {
      price = await getRedstonePrice(RedstoneProvider, symbol);
      console.log("Price: ", Number(price));
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

  return {
    compatible_tokens,
    unsupported_tokens
  }
}