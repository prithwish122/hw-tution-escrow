require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.28",
  paths: {
    artifacts: "./src",
  },
  networks: {
    opencampus: {
      url: `https://open-campus-codex-sepolia.drpc.org`,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      opencampus: "your-etherscan-api-key",
    },
    customChains: [
      {
        network: "opencampus",
        chainId: 656476,
        urls: {
          apiURL: "https://open-campus-codex-sepolia.drpc.org",
          browserURL: "https://opencampus-codex.blockscout.com",
        },
      },
    ],
  },
};