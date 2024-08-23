import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const deployer_pk = process.env.DEPLOYER_PK ? [process.env.DEPLOYER_PK] : [""];

const config: HardhatUserConfig = {
  solidity: "0.8.24",

  networks: {
    arbitrum: {
      "url": "https://arb1.arbitrum.io/rpc",
      "chainId": 42161,
      accounts: deployer_pk
    },
    polygon: {
      "url": "https://polygon-pokt.nodies.app",
      "chainId": 137,
      accounts: deployer_pk
    },
    bsc: {
      "url": "https://bsc-dataseed.binance.org",
      "chainId": 56,
      accounts: deployer_pk
    },
  },

  etherscan: {
    apiKey: {
      arbitrumOne: "Y6JFVD1JI1SR46SKMJNM7PI5NQ79F9UK7N",
      polygon: "JPI9X489SP9V3IHBJX4KI9SDMQ53643JPH",
      bsc: "PPFJ34FMR3BPHXMATQ3V63ZQ2VI1ARYARH"
    },
  }
};

export default config;
