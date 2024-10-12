import { Network } from '../../types';
import abi from "../../abi.json";


export function getProviderAbi(chainId: number): Array<Object> {
  return chainId === Network.Arbitrum ? 
    abi["arbitrum-prod-abi"] :
    abi["primary-prod-abi"];
}