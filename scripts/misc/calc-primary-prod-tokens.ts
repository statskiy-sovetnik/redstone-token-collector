const PATH = "redstone-primary-prod-tokens.json";
import { promises as fs } from "fs";

async function main() {
  try {
    // Read the file
    const data = await fs.readFile(PATH, 'utf-8');
    
    // Parse the JSON data
    const jsonObject = JSON.parse(data);
    
    // Calculate the number of keys in the object
    const numberOfKeys = Object.keys(jsonObject).length;
    
    // Log the result
    console.log(`Number of tokens in redstone-primary-prod: ${numberOfKeys}`);
  } catch (err) {
    console.error('Error reading or processing the file:', err);
  }
}

main()
  .then()
  .catch(err => {
    console.log(err);
  });
