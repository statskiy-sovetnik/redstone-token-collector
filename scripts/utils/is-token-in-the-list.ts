import { Token } from '../../types';

export function isTokenInTheList(list: Array<Token>, symbol: string): boolean {
  const res = list.find((_t: Token) => {
    return _t.symbol === symbol;
  });

  return res !== undefined;
}