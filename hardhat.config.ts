import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
	solidity: "0.8.18",
	networks: {
		hardhat: {
			forking: {
				enabled: true,
				url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`,
				blockNumber: 37180000,
			},
			accounts: {
				accountsBalance: "10000000000000000000000000", //(10_000_000 MATIC).
			},
			chainId: 137,
		},
	},
	mocha: {
		timeout: 600000,
	},
};

export default config;
