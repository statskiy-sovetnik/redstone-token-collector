
1. Create the lists of tokens, supported by Odos and 1inch for each network. 
`npx hardhat run ./scripts/post-one-inch-tokens.ts --network arbitrum`

You can get Odos tokens manually from the file. Check out the Odos documentation.

2. Check those lists of tokens for Redstone support. It updates the "compatible and unsupported tokens" files. 
`npx hardhat run ./scripts/filter-one-inch-tokens --network arbitrum`
`npx hardhat run ./scripts/filter-odos-tokens --network arbitrum`

3. Finally, extend the "aspis funds" and "aspis tokens" files with the compatible tokens. 

`npx hardhat run ./scripts/update-aspis-supported-tokens --network arbitrum`
