import 'dotenv/config'
import axios from 'axios';
import { Token } from '../types';
import hre from "hardhat";

type Tags = {
  tokens: Object,
  savings: Object,
  pools: Object,
  collectibles: Object,
  staking: Object,
  native: Object
}

type OneInchResponse = {
  tags: Tags
  tags_order: Array<string>
  tokens: Array<Object>
}

export async function getOneInchTokens(): Promise<Array<Token> | undefined> {
  const chain_id: number = hre.network.config.chainId!; 
  const api_key: string = process.env.ONE_INCH_API_KEY!;
  const base_url = "https://api.1inch.dev/token"
  const headers = { "Authorization": `Bearer ${api_key}`, "accept": "application/json" }

  const endpoint = `/v1.2/${chain_id}/token-list`
  const params = {
    //"cf-ipcountry": undefined,
    "provider": "1inch",
    //"country": undefined
  }

  const response = await axios.get(base_url + endpoint, {
    headers: headers,
    params: params
  })
  const res = response.data as OneInchResponse;

  return res.tokens as Array<Token>;
}