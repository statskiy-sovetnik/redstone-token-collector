import { OdosTokenMap, Token } from '../../types';

export function formatOdosTokens(chainId: number, odosResult: OdosTokenMap): Array<Token> {
  const arr = new Array<Token>();

  for (let token_addr in odosResult) {
    const t: Token = {
      address: token_addr,
      symbol: odosResult[token_addr].symbol,
      name: odosResult[token_addr].name,
      decimals: odosResult[token_addr].decimals,
      chainId: chainId
    }

    arr.push(t);
  }

  return arr;
}