import { AspisFund } from '../../types';

export function isAspisFundInTheList(list: Array<AspisFund>, symbol: string): boolean {
  const res = list.find((_t: AspisFund) => {
    return _t.baseToken === symbol;
  });

  return res !== undefined;
}