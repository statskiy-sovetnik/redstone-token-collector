import axios from 'axios';
const PATH = "redstone-primary-prod-tokens.json";
import { promises as fs } from "fs";
import { GarbageQuotes } from './config';


async function main() {
  const base_url = "https://oracle-gateway-1.a.redstone.finance"
  const headers = { "accept": "application/json" }
  const endpoint = `/data-packages/latest/redstone-primary-prod`;

  const response = await axios.get(base_url + endpoint, {
    headers: headers,
  });
  let tokens_data = response.data;

  tokens_data = removeGarbageTokens(tokens_data);

  await fs.writeFile(PATH, JSON.stringify(tokens_data, null, 2));
}

function removeGarbageTokens(tokens_data: Object) {
  for (let token_id in tokens_data) {
    if (GarbageQuotes.some(garbage => token_id.includes(garbage))) {
      // @ts-ignore
      delete tokens_data[token_id];
    }
  }

  return tokens_data;
}


main()
.then()
.catch(err => {
  console.log(err);
})